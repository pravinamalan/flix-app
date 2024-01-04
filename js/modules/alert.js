export function Showalert(message,className){
    const alertEl = document.createElement('div');
    alertEl.classList.add('alert',className);
    alertEl.appendChild(document.createTextNode(message));
    document.querySelector('#alert').appendChild(alertEl);
    
    setTimeout(() => {
        alertEl.remove()
    }, 3000);
}