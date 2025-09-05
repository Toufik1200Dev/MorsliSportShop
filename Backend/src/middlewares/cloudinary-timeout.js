module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Only apply to upload routes
    if (ctx.path.includes('/api/upload') || ctx.path.includes('/upload')) {
      // Set a longer timeout for upload requests
      const originalTimeout = ctx.req.timeout;
      ctx.req.timeout = 120000; // 2 minutes
      
      // Add memory management for bulk uploads
      const files = ctx.request.files || ctx.request.file;
      if (files) {
        const fileArray = Array.isArray(files) ? files : [files];
        
        // Limit concurrent uploads to prevent memory issues
        if (fileArray.length > 10) {
          strapi.log.warn(`Bulk upload detected: ${fileArray.length} files. Processing in batches.`);
          
          // Process files in batches of 3 for very large uploads
          const batchSize = fileArray.length > 50 ? 3 : 5;
          const results = [];
          
          for (let i = 0; i < fileArray.length; i += batchSize) {
            const batch = fileArray.slice(i, i + batchSize);
            strapi.log.info(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(fileArray.length/batchSize)}`);
            
            // Process each file in the batch
            for (const file of batch) {
              try {
                // Add small delay between uploads to prevent overwhelming
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Process individual file
                ctx.request.file = file;
                await next();
                
                results.push({ success: true, file: file.name });
              } catch (error) {
                strapi.log.error(`Upload failed for ${file.name}:`, error.message);
                results.push({ success: false, file: file.name, error: error.message });
              }
            }
            
            // Add delay between batches (longer for very large uploads)
            if (i + batchSize < fileArray.length) {
              const delay = fileArray.length > 50 ? 2000 : 1000; // 2s for 50+, 1s for smaller
              await new Promise(resolve => setTimeout(resolve, delay));
            }
          }
          
          // Return batch results
          ctx.body = { 
            message: 'Bulk upload completed',
            results: results,
            success: results.filter(r => r.success).length,
            failed: results.filter(r => !r.success).length
          };
          return;
        }
      }
      
      // Add retry logic for Cloudinary timeouts
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          await next();
          break; // Success, exit retry loop
        } catch (error) {
          if (error.message && error.message.includes('Request Timeout') && retryCount < maxRetries - 1) {
            retryCount++;
            strapi.log.warn(`Cloudinary upload timeout, retry ${retryCount}/${maxRetries}`);
            
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));
            continue;
          }
          throw error; // Re-throw if not a timeout or max retries reached
        }
      }
    } else {
      await next();
    }
  };
};
