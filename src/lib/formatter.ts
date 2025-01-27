 const compactNumber = new Intl.NumberFormat(undefined, {
        notation: "compact"
    })


export function formatCompactNumber(num:number){
    return compactNumber.format(num)
}