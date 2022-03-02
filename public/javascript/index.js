let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".sidebarBtn");
sidebarBtn.onclick = function() {
  sidebar.classList.toggle("active");
  if(sidebar.classList.contains("active")){
  sidebarBtn.classList.replace("bx-menu" ,"bx-menu-alt-right");
}else
  sidebarBtn.classList.replace("bx-menu-alt-right", "bx-menu");
}



//Pie Chart

//using an li tag


// $(document).ready(function () {
//   $('<input type="checkbox" name = "checkthis" value="<%=item._id%>" onChange = "this.form.submit()" />').prependTo(".date");
// });






