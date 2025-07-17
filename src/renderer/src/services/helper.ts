const baseURL = 'https://snehalayaa.brightoncloudtech.com/api/v1'

if (!baseURL) {
  console.error('❌ VITE_API_URL is not defined in the environment variables.')
}

export default baseURL
