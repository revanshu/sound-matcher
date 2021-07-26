import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  databaseRecordings;
  filteredDatabaseRecordings;
  inputRecordings;
  selectedInputRecordings;
  selectedDatabaseRecordings;
  resolvedInputs = [];
  headersArray;

  constructor(private http: HttpClient){
    const databaseCsv = 'assets/sound_recordings.csv';
    const inputReportCsv = 'assets/sound_recordings_input_report.csv';
    this.http.get(databaseCsv, {responseType: 'text'}).subscribe({
        next: data => {
            this.databaseRecordings = this.convertCsvToArray(data);
        }
    });
    this.http.get(inputReportCsv, {responseType: 'text'}).subscribe({
        next: data => {
            const csvToRowArray = data.split('\n');
            this.headersArray = csvToRowArray[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            this.inputRecordings = this.convertCsvToArray(data);
            this.showAllClick();
        }
    });
  }

  private convertCsvToArray(data) {
    const csvToRowArray = data.split('\n');
    const soundTable = [];
    for (let i = 1; i < csvToRowArray.length; i++) {
        const columns = csvToRowArray[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (columns.length === 4) {
            soundTable.push(columns);
        }
    }
    return soundTable;
  }

  rowSelected(row){
      this.selectedInputRecordings = row;
      this.filteredDatabaseRecordings = this.databaseRecordings.filter(col => {
        return col[0].includes(this.selectedInputRecordings[0]) || col[1].includes(this.selectedInputRecordings[1]);
      });
      this.selectedDatabaseRecordings = null;
  }

  rowSelectedDatabase(row){
    this.selectedDatabaseRecordings = row;
}

  resolveClick() {
    if (!this.selectedDatabaseRecordings || !this.selectedInputRecordings){
        alert('Please select input recording and its corresponding matching recording');
        return;
    }
    this.resolvedInputs.push(this.selectedDatabaseRecordings);
    this.inputRecordings = this.inputRecordings.filter(col => {
        return col !== this.selectedInputRecordings;
    });
    this.selectedInputRecordings = null;
    this.selectedDatabaseRecordings = null;
    this.showAllClick();
  }

  showAllClick() {
    this.filteredDatabaseRecordings = this.databaseRecordings;
  }

  addAsNew() {
    this.resolvedInputs.push(this.selectedInputRecordings);
    this.inputRecordings = this.inputRecordings.filter(col => {
        return col !== this.selectedInputRecordings;
    });
    this.selectedInputRecordings = null;
  }
}
