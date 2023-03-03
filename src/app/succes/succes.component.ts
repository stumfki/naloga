import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface GiphyResponse {
  data: any[];
  pagination: any;
  meta: any;
}

@Component({
  selector: 'app-succes',
  templateUrl: './succes.component.html',
  styleUrls: ['./succes.component.sass']
})
export class SuccesComponent {
//http://api.giphy.com/v1/gifs/search?api_key=KeTn0RgXZQF8EDkUGgQmSaJYuWPEz5mI&q=barber
constructor(private http: HttpClient) { }

image: string = ""

 getRandomNumber(): number {
  return Math.floor(Math.random() * 49) + 1;
}

ngOnInit() {
  this.http.get<GiphyResponse>('http://api.giphy.com/v1/gifs/search?api_key=KeTn0RgXZQF8EDkUGgQmSaJYuWPEz5mI&q=barber').subscribe((response) => {
    console.log(response);
    console.log(response.data[0].images.fixed_height.url);
    this.image = response.data[this.getRandomNumber()].images.fixed_height.url
  },
  (error) => {
    this.image = "assets/barber.gif"
  });
}


}
