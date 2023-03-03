import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DateAdapter } from '@angular/material/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit{

constructor(private formBuilder: FormBuilder, private http: HttpClient, private dateAdapter: DateAdapter<Date>,  private router: Router) {}

  services: any[] = [];
  barbers: any[] = [];
  selectedBarber: string = "";
  form: FormGroup = new FormGroup({});
  appointments: any[] = []

   

ngOnInit() {

  this.form = this.formBuilder.group({

    name: ['', Validators.required],
    surname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    contactNumber: ['', [Validators.required, this.sloveneNumberValidator()]],
    barber: ['', Validators.required],
    service: ['', Validators.required],
    date: ['', Validators.required],
    time: ['', Validators.required]

  });

  this.http.get<any[]>('http://localhost:3000/services').subscribe((data) => {

    for(let item of data) {
      this.services.push(item)
    }
   
  });

  this.http.get<any[]>('http://localhost:3000/barbers').subscribe((data) => {

     this.barbers = data

  });

  this.http.get<any[]>('http://localhost:3000/appointments').subscribe((data) => {

    for(let appointment of data) {
     this.appointments.push(appointment)
    }

  });


}


//Setting Date

minDate: Date = new Date();
maxDate: Date = new Date();

minDateTime: Date = new Date();
maxDateTime: Date = new Date();

weekendsDatesFilter = (d: Date | null): boolean => {
  const day = (d || new Date()).getDay();
  
  return day !== 0 && day !== 6;
};



test() {
  console.log(this.barbers)
}




//Price for the service

price: string = "Please select a service"

onServiceChange(event: any) {
  const selectedServiceId =  Number(event.target.value)

  for(let service of this.services) {
    if(selectedServiceId === service.id) {
      this.price = "Price is " + this.services[selectedServiceId - 1].price + " €"
      
    }
  }

}

//Submit

submitted: boolean = false;
formUnix = {}
onSubmit() {
  
  if (this.form != null) {

  //Convert to unix

    const dateString = this.form.get('date')
    const timeString = this.form.get('time')
    const dateTimeString = dateString + 'T' + timeString + ':00';
    const dateTime = new Date(dateTimeString);
    const unixTimestamp = Math.floor(dateTime.getTime() / 1000);

  //--------------


    const formData = {
      barberId: this.form.get('barber')?.value,
      serviceId: this.form.get('service')?.value,
      startDate: unixTimestamp
    
    }
    this.formUnix = formData
  }
  this.submitted = true;

  if (this.form.valid) {
    console.log("-----------------------------------------------")
    console.log("Sending data to server. Waiting for a response.")
    console.log("-----------------------------------------------")

      this.http.post('http://localhost:3000/appointments', this.formUnix)
      .subscribe(
        (response) => {
          console.log('Appointment saved successfully', response);
          this.router.navigate(['/success'])
        },
        (error) => {
          console.log('Error while saving appointment', error);
        }
      );

     

      
  }
}




sloveneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const number = control.value;
    if (!number) {

      return null;
    }

 
    const pattern = /^386[1-9][0-9]{6,7}$/;
    const valid = pattern.test(number);
    return valid ? null : { invalidSloveneNumber: true };
  };

}}