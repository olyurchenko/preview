import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {FormsModule} from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import {MentionStyled} from './mention-styled';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    QuillModule.forRoot(),
  ],
  providers: [MentionStyled],
  bootstrap: [AppComponent]
})
export class AppModule { }
