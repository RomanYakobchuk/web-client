export const rounded = function (number: number | string) {
    return Math.round((typeof number === "string" ? parseFloat(number) : number) * 100) / 100;
}