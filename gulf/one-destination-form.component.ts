import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Languages } from '@core/helpers';
import {
  CabinClassShortcut,
  DateFormat,
  DestinationsResponseInterface,
  FlightType,
  FlightTypeTab,
  SearchFlightDates,
  SearchFlightDestinationLabels,
  SearchFlightFormItem,
  SearchFlightToggles
} from '@models';
import {
  select,
  Store
} from '@ngrx/store';
import {
  DATES_FORM,
  DATES_FORM_CONFIG,
  FLIGHTS_DATE_OPTIONS,
  SEARCH_TOGGLES_OPTIONS
} from '@pages/search-page/search-page.const';
import {
  SearchPageState,
  selectAllDestinations
} from '@pages/search-page/store';
import { TranslatePipe } from '@shared/pipes/translation.pipe';
import {
  SDatePickerOptions,
  SelectedDisplayType,
  TypeaheadSelectFieldOptions
} from '@styleguide';
import { isEqual as _isEqual } from 'lodash/isEqual';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
	selector: 'gf-one-destination-form',
	templateUrl: './one-destination-form.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OneDestinationFormComponent implements OnInit {
	@Input() public lang: Languages
	@Input() public flightType: FlightType
	@Input() public flightTypeName: FlightTypeTab
	@Input() public form: FormGroup
	public searchFlightDatesForm = SearchFlightDates
	public flightTypeOptions = FlightType
	public datePickerOptions = FLIGHTS_DATE_OPTIONS
	public inputName = SearchFlightDestinationLabels
	public options: TypeaheadSelectFieldOptions
	public destinationInputs: SearchFlightDestinationLabels[]
	public destinationInputFormControlName: {
		[key: string]: string
	}
	public datesForm = DATES_FORM
	public datesFormConfig = DATES_FORM_CONFIG
	public searchToggles = SearchFlightToggles
	public searchTogglesOptions = SEARCH_TOGGLES_OPTIONS
	public cabinClass = CabinClassShortcut
	public searchFlightFormItem = SearchFlightFormItem
	public allDestinations$: Observable<DestinationsResponseInterface[]>
	public destinationInputIcons: { [key: string]: string }

	constructor(private store: Store<SearchPageState>, private translationPipe: TranslatePipe) {}

	public ngOnInit(): void {
		this.allDestinations$ = this.store.pipe(select(selectAllDestinations))

		this.destinationInputs = [this.inputName.From, this.inputName.To]

		this.destinationInputIcons = {
			[this.inputName.From]: 'starting-gold.svg',
			[this.inputName.To]: 'landing-gold.svg',
		}

		this.destinationInputFormControlName = {
			[this.inputName.To]: this.searchFlightFormItem.Destination,
			[this.inputName.From]: this.searchFlightFormItem.Origin,
		}

		this.options = {
			source: this.countriesSource,
			equals: _isEqual,
			debounceTime: 0,
			preferredSelectedDisplayType: SelectedDisplayType.asText,
			inputValueFormatting: (item: DestinationsResponseInterface) => `${item.name} - ${item.value}`,
			showIcon: false,
			manageErrors: false,
		}
	}

	public countriesSource = (value: string) =>
		this.allDestinations$.pipe(
			map((countries: DestinationsResponseInterface[]) =>
				countries.filter(
					(country: DestinationsResponseInterface) =>
						country.value.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
						country.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())
				)
			)
		)

	public onDateChange(dateType: string, $event: SDatePickerOptions): void {
		this.setDateToForm(dateType, $event.firstDate as moment.Moment)
		if (dateType === this.searchFlightFormItem.Departure) {
			this.updateReturnDateOptions($event.firstDate as moment.Moment)
		}
	}

	public setDateToForm(dateType: string, value: moment.Moment): void {
		this.form.get(dateType).setValue(moment(value).format(DateFormat.Request))
	}

	public updateReturnDateOptions(minDate: moment.Moment): void {
		const returnDate: moment.Moment = minDate && moment(minDate).add(1, 'd')
		this.setDateToForm(this.searchFlightFormItem.Return, returnDate as moment.Moment)

		this.datesFormConfig[this.searchFlightDatesForm.Return].config = {
			...this.datesFormConfig[this.searchFlightDatesForm.Return].config,
			firstDate: minDate && moment(returnDate).format(DateFormat.Display),
			restrictions: [(date: moment.Moment) => date <= moment(minDate).subtract(1, 'd')],
		}
	}

	public onToggleChange(toggleProp: string, value: string): void {
		if (toggleProp === this.searchToggles.Flex) {
			// TODO
		} else {
			this.form
				.get(this.searchTogglesOptions[toggleProp])
				.setValue(value ? this.cabinClass.Business : this.cabinClass.Any)
		}
	}

	public translateDestination(value: DestinationsResponseInterface): string {
		const translationKey = `common_country_${value.country_code}`
		return `${this.translationPipe.transform(translationKey, {
			lang: this.lang,
		})} - ${value.value}`
	}
}
