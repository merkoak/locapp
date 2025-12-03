import { type NextConfig } from 'next'; // NextConfig tipi buraya eklendi

const nextConfig: NextConfig = {
  // IBM-Watson için gerekli dış paket tanımı
  serverExternalPackages: ['ibm-watson'],
};

export default nextConfig;