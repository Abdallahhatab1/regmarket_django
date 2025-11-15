


function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (isMobile()) {
  alert("Sorry, this site is not support mobiles!\nالمعذرة, هذا الموقع لا يدعم الهواتف!\n ):");
} 
else {
  document.body.style.display = 'block'
}