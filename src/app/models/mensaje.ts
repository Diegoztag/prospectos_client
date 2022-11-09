import { ToasterService, Toast } from 'angular2-toaster';

export class Mensaje {
  constructor(public toasterServ: ToasterService) {}
  public onMessage(info: Toast) {
    const toaster: Toast = info;
    this.toasterServ.pop(toaster);
  }

  public messageError(info: string) {
    const toaster: Toast = { type: 'error', title: 'Mensaje', body: info };
    this.toasterServ.pop(toaster);
  }

  public messageWarning(info: string) {
    const toaster: Toast = {
      type: 'warning',
      title: 'Información',
      body: info,
    };
    this.toasterServ.pop(toaster);
  }

  public messageSuccess(info: string) {
    const toaster: Toast = { type: 'success', title: 'Mensaje', body: info };
    this.toasterServ.pop(toaster);
  }

  public messageInfo(info: string) {
    const toaster: Toast = { type: 'info', title: 'Mensaje', body: info };
    this.toasterServ.pop(toaster);
  }
}
