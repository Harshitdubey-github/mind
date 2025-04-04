import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { SUPABASE_URL, SUPABASE_KEY } from './config.js';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Files to upload
const filesToUpload = [
  'index.html',
  'actions.html',
  'journal.html',
  'scripts.js',
  'config.js'
];

// Bucket name
const BUCKET_NAME = 'mindaid-app';

async function deployToSupabase() {
  console.log('Starting deployment to Supabase...');
  
  try {
    // Check if bucket exists, create if not
    const { data: buckets, error: bucketListError } = await supabase.storage.listBuckets();
    
    if (bucketListError) {
      console.error('Error listing buckets:', bucketListError.message);
      return;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      console.log(`Creating bucket: ${BUCKET_NAME}`);
      const { error: createBucketError } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true
      });
      
      if (createBucketError) {
        console.error('Error creating bucket:', createBucketError.message);
        return;
      }
      
      // Set bucket to public after creation
      const { error: updateBucketError } = await supabase.storage.updateBucket(BUCKET_NAME, {
        public: true
      });
      
      if (updateBucketError) {
        console.error('Error setting bucket to public:', updateBucketError.message);
      }
    }
    
    // Upload each file
    for (const file of filesToUpload) {
      try {
        console.log(`Uploading ${file}...`);
        
        // Fetch the file content
        const response = await fetch(file);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${file}: ${response.statusText}`);
        }
        
        const fileContent = await response.text();
        const blob = new Blob([fileContent], { 
          type: file.endsWith('.html') ? 'text/html' : 
                file.endsWith('.js') ? 'application/javascript' : 'text/plain' 
        });
        
        // Upload to Supabase
        const { data, error } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(file, blob, {
            cacheControl: '3600',
            upsert: true
          });
        
        if (error) {
          console.error(`Error uploading ${file}:`, error.message);
          continue;
        }
        
        console.log(`Successfully uploaded ${file}`);
        
        // Make file public if it's uploaded
        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(file);
        
        console.log(`Public URL: ${urlData.publicUrl}`);
        
      } catch (error) {
        console.error(`Error uploading ${file}:`, error.message);
      }
    }
    
    console.log('Deployment complete!');
    console.log(`Your app is available at: ${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/index.html`);
    
    // Print instructions for manual bucket policy configuration if needed
    console.log('\nIf your files are not publicly accessible, please:');
    console.log('1. Log in to your Supabase dashboard');
    console.log('2. Go to Storage → Buckets');
    console.log(`3. Find the '${BUCKET_NAME}' bucket`);
    console.log('4. Click on "..." and select "Set bucket permissions"');
    console.log('5. Set the bucket to public');
    
  } catch (error) {
    console.error('Deployment failed:', error.message);
  }
}

// Run deployment
deployToSupabase().catch(error => {
  console.error('Unhandled deployment error:', error.message);
}); 