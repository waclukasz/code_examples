import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Languages } from '@core/helpers';
import {
  select,
  Store
} from '@ngrx/store';
import { TranslationService } from '@services';
import {
  AppState,
  language as selectedLanguage,
  MainAppState
} from '@store';
import {
  Observable,
  of
} from 'rxjs';
import {
  first,
  map,
  switchMap,
  take
} from 'rxjs/operators';
import { initLanguage } from 'src/app/store/app-store.actions';

@Injectable({ providedIn: 'root' })
export class TranslationsGuard implements CanActivate {
  constructor(
    public translationService: TranslationService,
    public store: Store<AppState | MainAppState>
  ) {}

  public canActivate(): Observable<boolean> {
    return this.getTranslations().pipe(switchMap(() => of(true)));
  }

  private getTranslations(): Observable<Languages> {
    return this.store.pipe(
      select(selectedLanguage),
      map((language: Languages) => {
        if (!!language) {
          return language;
        } else {
          const lang: Languages = this.translationService.getInitialLanguage();
          this.translationService
            .translateApplication(lang)
            .pipe(take(1))
            .subscribe(() => {
              this.store.dispatch(initLanguage({ language: lang }));
            });
        }
      }),
      first((fetchedLanguage: Languages) => !!fetchedLanguage)
    );
  }
}
