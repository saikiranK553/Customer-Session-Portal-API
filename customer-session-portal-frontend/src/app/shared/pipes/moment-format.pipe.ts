import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';
@Pipe({
  name: 'moment',
})
export class MomentFormatPipe implements PipeTransform {
  transform(date: Date, format: string): string {
    return moment(date).format(format);
  }
}
