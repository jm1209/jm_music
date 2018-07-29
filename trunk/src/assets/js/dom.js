export function getAttrData(el,name,val) {
  const prefix = 'data-';

  name = prefix + name;

  if(val){
    return el.getAttribute(name,val);
  }else{
    return el.getAttribute(name)
  }
}
