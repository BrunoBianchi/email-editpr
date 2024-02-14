import {  Component, HostListener,  OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { HtmlRenderPipe } from '../../../../shared/pipes/html-render.pipe';
import { PasswordModule } from 'primeng/password';
@Component({
  selector: 'app-editor-page',
  standalone: true,
  imports: [CdkDrag, CdkDropList, CdkDragPlaceholder, HtmlRenderPipe,PasswordModule],
  templateUrl: './editor-page.component.html',
  styleUrl: './editor-page.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class EditorPageComponent implements OnChanges {
  public currentHtmlElement: any;
  public date: Date | undefined;
  public oldHtmlElement: any;
  @HostListener('document:click', ['$event'])
  public documentClick(event: any): void {
    const editor: any = (document.getElementById('inline-editor') as HTMLInputElement)
    if (editor != null && event.target && (event.target.localName.toString() == 'app-editor-page' || event.target.className == 'col-md-1' || event.target.tagName == 'HTML')) {
      let editor_input: any = (document.getElementById('inline-editor-input') as HTMLInputElement)
      const value = editor_input.value
      this.currentHtmlElement.innerText = value;
      editor.remove()
    }
  }

  @HostListener('click', ['$event.target'])
  onClick(btn: any) {
    if (!btn.className.includes("from-editor")) {
      if (btn.className.includes('function')) {
        const func = btn.className.split('function-')[1];
        if (!btn.id.includes('-clicked')) {
          btn.id += '-clicked';
          (this as any)[func.split("(")[0]](func.split("(")[1].replace('(', '').replace(')', '').split(','));
        } else {
          btn.id = btn.id.replace('-clicked', '');
          this.undoCss(func.split("(")[1].replace('(', '').replace(')', '').split(','))
        }
      }
    } else {
      if (btn.className.includes('function')) {
        const func = btn.className.split('function-')[1];
        (this as any)[func](func);
      }

    }


  }

  movies = [
    `<h1 style="color:blue">Teste</h1>`,
    `<h1 style="color:blue">Teste2</h1>`,
    `<section> <h3>Section example</h3>  <p>testee</p></section>`,
    `<ul> <li>Section example</li>  <li>Section example2</li> <li>Section example3</li></ul>`,
    `<hr>`,
    `<button >Really Cool Button</button>`
  ];
  public canEdit = false;
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
  }

  editHTML(event: any) {
    if (event.target.id.includes("inline")) return;



    if (!['div', 'ul', 'input', 'hr', 'section'].some((block: string) => { return  event.target.tagName.toLocaleLowerCase() == block })) {
      this.currentHtmlElement = event.target;
      let editorHtml = ` 
      <div id='inline-editor' >
      <button id='inline-close' class="fa-solid fa-square-minus from-editor function-removeEditor"></button>
      <button id='inline-delete' class="fa-solid fa-trash from-editor function-deleteComponent"></button>
        <ul id='inline-ul'>
  
        <li id='inline-list'>
        <button id='inline-editor-btn' class="function-inlineEditorElement(font-weight,bold)">
          B
        </button>
        </li>
  
        <li id='inline-list'>
        <button id='inline-editor-btn' class="function-inlineEditorElement(font-style,italic)">
          I
        </button>
        </li>
        <li id='inline-list'>
        <button id='inline-editor-btn' style='text-decoration:underline' class="function-inlineEditorElement(text-decoration,underline)">
          U
        </button>
        </li>
         </ul>
  
      <input id='inline-editor-input'  value='${event.target.innerText}'  pInputText pAutoFocus [autofocus]="true"> </input>
      </div>
      `
      let editor: any = (document.getElementById('inline-editor') as HTMLInputElement)

      if (this.oldHtmlElement) {
        let editor_input: any = (document.getElementById('inline-editor-input') as HTMLInputElement)
        const value = editor_input ? editor_input.value : this.oldHtmlElement.innerText
        this.currentHtmlElement.innerHTML = editorHtml;
        this.oldHtmlElement.innerText = value;
        if (editor) {
          editor.remove();
          editor_input = (document.getElementById('inline-editor-input') as HTMLInputElement)
          const ob = Object(this.currentHtmlElement.style)
          const keys = Object.keys(this.currentHtmlElement.style).filter((css: any) => { return ob[css].length > 0 });
          keys.forEach((key: string) => {
            if (isNaN(Number(key))) {
              editor_input.style[key] = ob[key];

            }

          })
        }
        this.currentHtmlElement.innerHTML = editorHtml;
        this.oldHtmlElement = this.currentHtmlElement;
      } else {
        if (this.oldHtmlElement == this.currentHtmlElement) {
          return
        } else {
          this.currentHtmlElement.innerHTML = editorHtml
          this.oldHtmlElement = this.currentHtmlElement
        }

      }


      this.canEdit = true;
    } 
  }
  editElement(event: any, style: string) {

    const editor: any = (document.getElementById('inline-editor-input') as HTMLInputElement)
    editor.style[style] = event.target.value;
    this.currentHtmlElement.style[style] = event.target.value;
  }
  inlineEditorElement(style: string) {

    const editor: any = (document.getElementById('inline-editor-input') as HTMLInputElement)
    editor.style[style[0]] = style[1];
    this.currentHtmlElement.style[style[0]] = style[1]
  }
  public undoCss(style: string) {

    const editor: any = (document.getElementById('inline-editor-input') as HTMLInputElement)
    editor.style[style[0]] = 'initial';
    this.currentHtmlElement.style[style[0]] = 'initial';

  }
  public removeEditor() {
    const editor: any = (document.getElementById('inline-editor') as HTMLInputElement)
    const editor_input: any = (document.getElementById('inline-editor-input') as HTMLInputElement)

    this.currentHtmlElement.innerText = editor_input.value;
    editor.remove()
  }
  public deleteComponent() {
    let parent = this.currentHtmlElement.parentNode;
    console.log(parent.parentNode.className)
    let childs: any = []
    parent.childNodes.forEach((child: any) => {
      if (child.toString() != "[object Text]" && child != this.currentHtmlElement) {
        childs.push(child)
      }
    })
    if (childs.length > 0) {
      this.currentHtmlElement.remove()
    } else {
      if (parent.parentNode.className == "cdk-drag component ") {
        parent.remove()
      } else {
        let aux = parent;
        while (aux.className != "cdk-drag component") {
          aux = aux.parentNode
        }
        aux.remove();
      }

    }


  }
 ngOnChanges(changes: SimpleChanges): void {
     console.log(changes)
 }
}
