## 🔬 Isotretinoin Dose Calculator
A simple calculator to speed the things up for dermotologists for isotretinoin treatment.

## 🤗 Who is this app for? 
Dermotologists who have little time or are too lazy to do math :)

## 🧮 Method
The user of the app enters daily doses for each previous month of the treatment. First the total intake so far is calculated with:
$$ \text{Total Used (mg)} = \sum_{i}^{n_{months}}30(day)\times\text{Daily Dose for Month $i$ (mg/day)} .$$ 

She, then enters mass of the patient and the targeted total dose of the whole treatment in per kg basis:
$$ \text{Total Target Dose (mg)} = \text{Mass (kg)} \times \text{Target Dose per Kg (mg/kg)} . $$ 
The app calculates how much additional isotretinoin should be intaken to reach the target total dose:
$$ \text{Total Dose Left (mg)} = \text{Total Target Dose (mg)} -\text{Total Used (mg)} . $$ 
Lastly, it outputs a naive estimation for the duration of the rest of the treatment based on the Total Dose Left and average daily dose in the treatment to that time:
$$ \text{Estimated Duration (months)} = \frac{\text{Total Dose Left (mg)}}{\text{Avarage Daily Dose (mg/day)} \times \text{30day/month} } ,$$
where
$$ \text{Avarage Daily Dose (mg/day)} =\frac{\sum_{i}^{n_{months}}\text{Daily Dose for Month $i$ (mg/day)}}{n_{months}} . $$

## To Run
```
pnpm run dev
```

One-click deploy to vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Focg2347%2Fisotretinoin-dose-calculator%2Ftree%2Fmain)