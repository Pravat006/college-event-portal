/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'img.clerk.com',
            'images.clerk.dev',
            'media.istockphoto.com',
            'images.unsplash.com',
            'cdn.pixabay.com',
            'images.pexels.com'
        ]
    }
}

module.exports = nextConfig