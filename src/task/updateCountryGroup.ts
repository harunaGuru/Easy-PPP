import countriesByDiscount from '../data/countriesByDiscount.json'
import { db } from '@/drizzle/db';
import { CountryGroupTable, CountryTable } from '@/drizzle/schema';
import { sql } from 'drizzle-orm';

const groupCount = await updateCountryGroup()
const countryCount = await updateCountries()

console.log(`Updated ${groupCount} country groups and ${countryCount} countries`)

async function updateCountryGroup() {
    const countryGroupInsert = countriesByDiscount.map(({name, recommendedDiscountPercentage})=>{
        return {
            name,
            recommendedDiscountPercentage
        }
    })

    const {rowCount} = await db.insert(CountryGroupTable).values(countryGroupInsert).onConflictDoUpdate({
        target: CountryGroupTable.name,
        set: {
            recommendedDiscountPercentage: sql.raw( `excluded.${CountryGroupTable.recommendedDiscountPercentage.name}`)
        }
    })
    
    return rowCount
}

async function updateCountries(){
    const countryGroups = await db.query.CountryGroupTable.findMany({
        columns:{id: true, name: true}
    })
 
    const countriesInsert = countriesByDiscount.flatMap(({countries, name})=>{
        const countrygroup = countryGroups.find((group)=> group.name === name)
        if(countrygroup == null){
            throw new Error(`Country group "${name}" not found`)
        }

        return countries.map(({country, countryName})=>{
            return {
                countryGroupId: countrygroup.id,
                code: country,
                name: countryName
            }
        })
})

const {rowCount} = await db.insert(CountryTable).values(countriesInsert).onConflictDoUpdate({
    target: CountryTable.code,
    set: {
        name: sql.raw(`excluded.${CountryTable.name.name}`),
        countryGroupId: sql.raw(`excluded.${CountryTable.countryGroupId.name}`)
    }
})

return rowCount
}