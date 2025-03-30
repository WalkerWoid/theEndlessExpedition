export const useGetRandomByRange = (range: [number, number]): number => {
    const [min, max] = range
    
    return Math.round(Math.random() * (max - min) + min);
}