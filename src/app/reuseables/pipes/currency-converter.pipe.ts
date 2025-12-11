import { Pipe, PipeTransform, inject } from '@angular/core';
import { StoreDataService } from '../http-loader/store-data.service'; // ✅ adjust path as needed

@Pipe({
  name: 'currencyConverter',
  standalone: true, // ✅ must be standalone
  // providedIn: 'root' // 👈 THIS makes it injectable in services

})

export class CurrencyConverterPipe implements PipeTransform {
  private storeData = inject(StoreDataService);

  transform(
    amount: number = 0,
    showSymbol: boolean = false,
    another_currency: string | false = false,
    minimumFractionDigits: number = 2
  ): string {
    const wallet = this.storeData.get('wallet');
    let init_currency = wallet?.init_currency;

    if (another_currency) {
      const found = wallet?.init_currencies.find((c: any) => c.code === another_currency);
      if (found) init_currency = found;
    }

    const rate = init_currency?.rate || 1;
    const symbol = init_currency?.symbol || '';
    let converted: number;

    if (symbol.toLowerCase() === 'trx') {
      converted = amount / rate;
    } else {
      converted = amount * rate;
    }

    // Always format with commas and fixed decimal places
    const formatted = converted.toLocaleString(undefined, {
      minimumFractionDigits,
      maximumFractionDigits: minimumFractionDigits
    });

    return showSymbol ? `${symbol}${formatted}` : formatted;
  }
}
