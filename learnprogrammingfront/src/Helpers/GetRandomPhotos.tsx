
const photos = ["/photos/GridPhotos/2.jpg",
                "/photos/GridPhotos/3.jpg",
                "/photos/GridPhotos/4.jpg",
                "/photos/GridPhotos/5.jpg",
                "/photos/GridPhotos/6.jpg",
                "/photos/GridPhotos/7.jpg",
                "/photos/GridPhotos/8.jpg",
                "/photos/GridPhotos/9.jpg"]

const GetRandomPhotos = (): string => {
    const randomIndex = Math.floor(Math.random() * photos.length);
    return photos[randomIndex];
}

export { GetRandomPhotos }