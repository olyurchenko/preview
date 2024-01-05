import { Component } from '@angular/core';
import {Blur, ContentChange, Focus} from 'ngx-quill';
import 'quill-mention';
import { v4 as uuidv4 } from 'uuid';
import { convert } from 'html-to-text';
import Quill from 'quill';

export interface Mention{
    id: string;
    value: string;
    url: string;
    link: string;
}
type range = {index: Number, length: Number};


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent{
  editor!: Quill;
  value: string = '';
  isCustomized = false;
  mentions = this.generateMentionList(10);
  massage = '';
  LIMIT_FOR_FORMATTING = 10;
  selectedMention: Mention[] = [];
  cursor_position: range | null = null;
  quillConfig = {
    toolbar: false,
    mention: {
        blotName: 'styled-mention',
        defaultMenuOrientation: "bottom",
        allowedChars: /^[A-Za-z0-9\sÅÄÖåäö]*$/,
        mentionDenotationChars: ['@'],
        showDenotationChar: false,
        
        renderItem: (mention: Mention) => {
          return this.createMentionDiv(mention)
        },
      onSelect: (item: Mention & {denotationChar: string}, insertItem: any) => {
          console.log(item,'item')
          insertItem(item);
        },
        source: (searchTerm: string, renderItem: any) => {
          //if (!this.isCustomized) {
          //    return
          //}
          if (searchTerm.length === 0) {
            renderItem(this.mentions, searchTerm);
          } else {
            const list = this.mentions.filter(mention => mention.value.includes(searchTerm));
            renderItem(list, searchTerm);
          }
        },
    },
  };

  get MAX_LENGTH() {
    return this.isCustomized? Infinity: this.LIMIT_FOR_FORMATTING
  }

  

  constructor() {}

  change(e: ContentChange) {
    const text = e.text;

    if (e.source !== 'api' && this.massage.length > this.MAX_LENGTH && !this.isCustomized) {
      e.editor.formatText(this.LIMIT_FOR_FORMATTING, Infinity, 'color', '#ff0000');
    }

    if (this.massage.length >= this.MAX_LENGTH && this.isCustomized) {
      e.editor.deleteText(this.MAX_LENGTH, e.editor.getLength());
    }

    this.massage = convert(this.value)
  }

  init(editor: Quill) {
    this.editor = editor;
  }

  blur(e: Blur) {
    this.cursor_position = e.editor.getSelection(true);
    e.editor.root.blur();
    const text = convert(this.value)
    console.log({text})
  }

  focus(e: Focus) {
    
  }

  private generateMentionList(count: number) {
    const mentionsArray = [];
    for (let i = 0; i < count; i++) {
      mentionsArray.push(this.generateMention());
    }

    return mentionsArray;
  }

  private generateMention(): Mention {
    return {
      id: uuidv4(),
      value: this.generateMentionValue(),
      url: 'https://cdn.pixabay.com/user/2015/10/16/09-28-45-303_250x250.png',
      link: 'https://www.npmjs.com',
    }
  }

  private generateMentionValue() {
    return Math.random().toString(36).substring(2,7);
  }

  private createMentionDiv(mention: Mention): HTMLDivElement {
    const div = document.createElement("div");
    div.classList.add("mention__item");

    const img = document.createElement("img");
    img.classList.add("mention__icon");
    img.setAttribute("src", mention.url);
    img.setAttribute("alt", mention.value);

    const mentionContentDiv = document.createElement("div");
    mentionContentDiv.classList.add("mention__content");

    const pDescription = document.createElement("p");
    pDescription.classList.add("mention__description");
    pDescription.innerText = mention.value;

    const pSubtitle = document.createElement("p");
    pSubtitle.classList.add("mention__subtitle");
    pSubtitle.innerText = mention.id;

    mentionContentDiv.appendChild(pDescription);
    mentionContentDiv.appendChild(pSubtitle);

    div.appendChild(img);
    div.appendChild(mentionContentDiv);

    return div;
  }

  handleCustomize() {
    this.isCustomized = true;
    this.editor.formatText(0, this.editor.getLength(), 'color', '#000');
    this.editor.deleteText(this.MAX_LENGTH, this.editor.getLength());
  }
}
