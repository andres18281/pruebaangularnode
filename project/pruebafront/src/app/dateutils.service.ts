import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateutilsService {

  constructor() { }
  updateDateRevision(dateRelease: string | null): string | null {
    if (dateRelease) {
      const dateReleaseValue = new Date(dateRelease);
      const dateRevisionValue = new Date(dateReleaseValue);
      dateRevisionValue.setFullYear(dateReleaseValue.getFullYear() + 1);

      // Formatear la fecha en formato de cadena (opcional)
      return dateRevisionValue.toISOString().substring(0, 10);
    }
    return null;
  }
}
