import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({ selector: '[appRestringirTipo]' })
export class RestringirTipoDirective {
  @Input()
  public conDecimales = false;

  @Input()
  public conNegativos = false;

  @Input()
  public separadorDecimal = '.';

  @Input()
  public permitir = 'numeros';

  @Input()
  public canCut = true;

  @Input()
  public canCopy = true;

  @Input()
  public canPaste = true;

  public valorAnterior = '';

  // --------------------------------------
  //  Regular expressions
  public enteroSinSigno = '^[0-9]*$';
  public enteroConSigno = '^-?[0-9]+$';
  public decimalSinSigno = '^[0-9]+(.[0-9]+)?$';
  public decimalConSigno = '^-?[0-9]+(.[0-9]+)?$';
  public soloLetras = '[a-zA-ZñÑáéíóúÁÉÍÓÚs ]';

  constructor(private hostElement: ElementRef) {}

  @HostListener('paste', ['$event'])
  public onPaste(e) {
    if (!this.canPaste) {
      e.preventDefault();
    } else {
      // obtener info del clipboard
      const value = e.clipboardData.getData('text/plain');
      this.validateValue(value, e);
    }
  }

  @HostListener('copy', ['$event'])
  public onCopy(e) {
    if (!this.canCopy) {
      e.preventDefault();
    }
  }

  @HostListener('cut', ['$event'])
  public onCut(e) {
    if (!this.canCut) {
      e.preventDefault();
    }
  }

  @HostListener('keydown', ['$event'])
  public onKeyDown(e: KeyboardEvent) {
    const cursorPosition: number = e.target['selectionStart'];
    const valorOriginal: string = e.target['value'];
    const key: string = this.getName(e);
    const controlOrCommand = e.ctrlKey === true || e.metaKey === true;
    const existeSigno = valorOriginal.includes('-');
    const existeSeparador = valorOriginal.includes(this.separadorDecimal);

    // allowed keys apart from numeric characters
    const teclasPermitidas = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Escape', 'Tab'];

    // when decimals are allowed, add
    // decimal separator to allowed codes when
    // its position is not close to the the sign (-. and .-)
    const separatorIsCloseToSign = existeSigno && cursorPosition <= 1;
    if (this.conDecimales && !separatorIsCloseToSign && !existeSeparador) {
      if (this.separadorDecimal === '.') {
        teclasPermitidas.push('.');
      } else {
        teclasPermitidas.push(',');
      }
    }

    // when minus sign is allowed, add its
    // key to allowed key only when the
    // cursor is in the first position, and
    // first character is different from
    // decimal separator
    const primerCaracterIsSeparator = valorOriginal.charAt(0) !== this.separadorDecimal;
    if (this.conNegativos && !existeSigno && primerCaracterIsSeparator && cursorPosition === 0) {
      teclasPermitidas.push('-');
    }

    // allow some non-numeric characters
    if (
      teclasPermitidas.indexOf(key) !== -1 ||
      // Allow: Ctrl+A and Command+A
      (key === 'a' && controlOrCommand) ||
      // Allow: Ctrl+C and Command+C
      (key === 'c' && controlOrCommand) ||
      // Allow: Ctrl+V and Command+V
      (key === 'v' && controlOrCommand) ||
      // Allow: Ctrl+X and Command+X
      (key === 'x' && controlOrCommand)
    ) {
      // let it happen, don't do anything
      return;
    }

    // save value before keydown event
    this.valorAnterior = valorOriginal;

    let regEx: string;

    switch (this.permitir) {
      case 'numeros':
        regEx = this.enteroSinSigno;
        break;
      case 'letras':
        regEx = this.soloLetras;
        break;
      default:
        e.preventDefault();
        break;
    }

    const isValid = new RegExp(regEx).test(key);
    if (isValid) {
      return;
    } else {
      e.preventDefault();
    }
  }

  public validateValue(value: string, e: any): void {
    let regEx: string;
    switch (this.permitir) {
      case 'numeros':
        regEx = this.getRegex();
        break;
      case 'letras':
        regEx = this.soloLetras;
        break;
      default:
        e.preventDefault();
        break;
    }
    const valid: boolean = new RegExp(regEx).test(value);
    if (valid) {
      return;
    } else {
      e.preventDefault();
    }
  }

  public getRegex(): any {
    let resp = '';

    if (!this.conDecimales && !this.conNegativos) {
      resp = this.enteroSinSigno;
    }
    if (!this.conDecimales && this.conNegativos) {
      resp = this.enteroConSigno;
    }
    if (this.conDecimales && !this.conNegativos) {
      resp = this.decimalSinSigno;
    }
    if (this.conDecimales && this.conNegativos) {
      resp = this.decimalConSigno;
    }
    return resp;
  }

  public getName(e: any): string {
    if (e.key) {
      return e.key;
    }
    // for old browsers
    if (e.keyCode && String.fromCharCode) {
      switch (e.keyCode) {
        case 8:
          return 'Backspace';
        case 9:
          return 'Tab';
        case 27:
          return 'Escape';
        case 37:
          return 'ArrowLeft';
        case 39:
          return 'ArrowRight';
        case 188:
          return ',';
        case 190:
          return '.';
        case 109:
          return '-';
        case 173:
          return '-';
        case 189:
          return '-';
        default:
          return String.fromCharCode(e.keyCode);
      }
    }
    return '';
  }
}
