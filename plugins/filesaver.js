import saveAs from '../lib/filesaver';

export default ({ app }, inject) => {
  inject('saveAs', saveAs)
}