window.onload = function() 
{
  document.getElementById("changes").style.visibility = 'hidden';
  document.getElementById("reset").onclick = resetFun;
  displayState();
  createTable();
  $("form").submit(function(e){
    e.preventDefault();
    insert();
  });
}

function resetFun()
{
  document.getElementById("submit").style.visibility = 'visible';
  document.getElementById("changes").style.visibility = 'hidden';
  document.getElementById('name').value ="";
  document.getElementById('mobile').value ="";
  document.getElementById('address').value ="";
  document.getElementById('p3').innerText = "";
  document.getElementById('state').value ="-1";
  document.getElementById("city-data").style.visibility = 'hidden';
}
function onSelectCity() //show city for selected state 
{
  document.getElementById("city-data").style.visibility = 'visible';
  var option = document.getElementById("state");
  var selectedOption = option.options[option.selectedIndex];
  console.log(selectedOption);
  var myData1={};
  myData1._id = selectedOption.getAttribute("sid");
  console.log(myData1._id);
  postRequest("http://localhost:3000/citydata", myData1, function(status,responseText){
    if(status == 200){
      try{
        data = JSON.parse(responseText);
        var list1 ='<select Name="city" id="city" class="form-control">';
        for(var i = 0; i < data.length; i++)
        {
          list1 += '<option value="'+data[i].name+'" class="opt" >'+data[i].name+'</option>';
        }   
        list1 +='</select>';  
        document.getElementById("city-data").innerHTML = list1;
      }
      catch(e){
        document.getElementById('p3').innerText = e;
      }
    }else{
      document.getElementById('p3').innerText = "Something went wrong please try again later";
    }
  });       
}

function displayState()
{
  getRequest("http://localhost:3000/states",function(status,responseText){
    if(status == 200){
      try{
        data = JSON.parse(responseText);
        var list ='<select Name="state" id="state" class="form-control" required>';
        list +='<option value="-1">Select-State</option>';
        for(var i = 0; i < data.length; i++)
        {
          list += '<option sid="'+data[i]._id+'" value='+data[i].name+' >'+data[i].name+'</option>';
        }   
        list+='</select>';  
        document.getElementById("state-data").innerHTML = list;
        for(var i = 0; i < data.length; i++){
          document.getElementById("state").onchange = onSelectCity;
        } 
      }
      catch(e){
        document.getElementById('p3').innerText = e;
      }
    }else{
      document.getElementById('p3').innerText = "Something went wrong please try again later";
    }  
  });
}

function createTable(){
  getRequest("http://localhost:3000/users",function(status,responseText){
    if(status == 200){
      try{
        data = JSON.parse(responseText);
        var table ='<table id ="table" style="width:100%";> \
                    <tr> \
                      <th>Delete</th>\
                      <th>Update</th>\
                      <th>Name</th> \
                      <th>Mobile</th> \
                      <th>Address</th> \
                      <th>State</th> \
                      <th>City</th> \
                      <th>Gender</th> \
                    </tr>';
        for(var i = 0; i < data.length; i++)
        {
          table += '<tr> \
             <td> <button oid=' + data[i]._id + ' class="delete-btn"  type="button">Delete</button></td>\
             <td> <button oid=' + data[i]._id + ' class="update-btn" id="update" type="button">Update</button></td>\
             <td>'+ data[i].name +'</td> \
             <td>'+ data[i].mobile +'</td> \
             <td>'+ data[i].address +'</td> \
             <td>'+ data[i].state +'</td>\
             <td>'+ data[i].city +'</td>\
             <td>'+ data[i].gender +'</td> \
           </tr>';
        }
        table += '</table>';
        document.getElementById("user-data").innerHTML = table;
        $('.delete-btn').click(function() {
          onDeleteClick(this);
        });
        $('.update-btn').click(function() {
           onUpdateClick(this);
        });
        // var del_arr = document.getElementsByClassName("delete-btn");
          // for(var i = 0; i < del_arr.length; i++){
          //   del_arr[i].onclick = onDeleteClick;
          // }
        // var up_arr = document.getElementsByClassName("update-btn");
          // for(var i=0;i<up_arr.length;i++){
          //   console.log("onUpdateClick");
          //   // up_arr[i].onclick = onUpdateClick;
          // }
      }
      catch(e){
        document.getElementById('p3').innerText = e;
      }
    }else{
      document.getElementById('p3').innerText = "Something went wrong please try again later";
    }  
  });    
}

function formValidation(){
  var name = document.getElementById('name').value;
  var mobile = document.getElementById('mobile').value;
  var address = document.getElementById('address').value;
  var state = document.getElementById("state").value;
  var city = document.getElementById("city") ? document.getElementById("city").value : -1;
  var myData = {};
  if(inputAlphabet(name)){
    myData.name = name;
  }else{
    document.getElementById('p3').innerText = "* For your name please use alphabets only *";
    return false;
  }

  if(inputNumber(mobile)){
    myData.mobile = mobile;
  }else{
    document.getElementById('p3').innerText = "*Invalid mobile number*";
    return false;
  }

  if(inputAddress(address)){
    myData.address = address;
  }else{
    document.getElementById('p3').innerText = "* Please enter Address *";
    return false;
  }

  if(inputSelect(state)){
    myData.state = state;
  }else{
    document.getElementById('p3').innerText = "* Please select state *";
    return false;
  }

  if(inputSelect(city)){
    myData.city = city;
  }else{
    document.getElementById('p3').innerText = "* Please select city *";
    return false;
  }

  if(document.getElementById("female").checked) myData.gender = document.getElementById("female").value;
  else myData.gender = document.getElementById("male").value;
  
  return myData;  
}

function insert(){
  var myData = formValidation();
  console.log("my data",myData);
  if(myData){
    postRequest("http://localhost:3000/insert", myData, function(status,responseText){
      if(status == 200){
        try{
          data = JSON.parse(responseText);
          console.log("data ",data);
          addRowToTable(myData,data);
        }
        catch(e){
          document.getElementById('p3').innerText = e;
        }
      }else{
        document.getElementById('p3').innerText = "Something went wrong please try again later";
      }
    });
  }
}
  
function onDeleteClick(self){
  var myData1={};
  var tab = document.getElementById("table");
  myData1._id = self.getAttribute("oid");
  postRequest("http://localhost:3000/delete", myData1, function(status,resp){
    if(status == 200){
      tab.deleteRow(self.parentNode.parentNode.rowIndex);
      console.log("row deleted");
    }
    else{
      document.getElementById('p3').innerText = "Something went wrong please try again later";
    }
  });
}
function addRowToTable(myData,data){
  var tabb = document.getElementById("table");
  var len = (tabb.rows.length);
  console.log("id of button",data.id);
  var row = tabb.insertRow(len).outerHTML='<tr>\
  <td><button oid="'+ data.id +'" type="button" class="delete-btn" >Delete</td>\
  <td><button oid="'+ data.id + '"type="button" class="update-btn">Update</td>\
  <td>'+myData.name+'</td>\
  <td>'+myData.mobile+'</td>\
  <td>'+myData.address+'</td>\
  <td>'+myData.state+'</td>\
  <td>'+myData.city+'</td>\
  <td>'+myData.gender+'</td>\
  <tr>';
  var newElements=document.querySelectorAll("[oid=\""+data.id+"\"]");
  $('.delete-btn').click(function() {
    onDeleteClick(this);
  });

  $('.update-btn').click(function() {
    onUpdateClick(this);
  });
  resetFun();
}

function onUpdateClick(self){
  console.log("=> console.log");
  document.getElementById("submit").style.visibility = 'hidden';
  document.getElementById("changes").style.visibility = 'visible';
  var id = self.getAttribute("oid");
  var table=document.getElementById("table");
  var row = self.parentElement.parentElement;
  console.log("row ",row);
  var rowdata = row;
  document.getElementById("name").value=row.cells[2].innerText;
  document.getElementById("mobile").value=row.cells[3].innerText;
  document.getElementById("address").value=row.cells[4].innerText;
  document.getElementById("state").value=row.cells[5].innerText;
  if(document.getElementById("state").value=="Maharashtra"){
    var list4="<select Name=\"city\" id=\"city\" class=\"form-control\">\
     <option value=\"Mumbai\" >Mumbai</option>\
     <option value=\"Pune\">Pune</option>\
     <option value=\"Nashik\" >Nashik</option>\
     <option value=\"Nagpur\" >Nagpur</option>\
     <option value=\"Thane\" >Thane</option>\
     </select>";
     document.getElementById("city-data").style.visibility = 'visible';
     document.getElementById("city-data").innerHTML = list4;

     document.getElementById("city").value=row.cells[6].innerHTML;
  }
  else if(document.getElementById("state").value=="Gujrat"){
    var list4="<select Name=\"city\" id=\"city\" class=\"form-control\">\
     <option value=\"Surat\" >Surat</option>\
     <option value=\"Rajkot\" >Rajkot</option>\
     <option value=\"Ahmedabad\" >Ahmedabad</option>\
     <option value=\"Vadodara\" >Vadodara</option>\
     </select>";
     document.getElementById("city-data").style.visibility = 'visible';
     document.getElementById("city-data").innerHTML = list4;
     document.getElementById("city").value=row.cells[6].innerHTML;
  }
  else if(document.getElementById("state").value=="Rajasthan"){
    var list4="<select Name=\"city\" id=\"city\" class=\"form-control\">\
     <option value=\"jaipur\" >jaipur</option>\
     <option value=\"Ajmer\" >Ajmer</option>\
     <option value=\"Pushkar\" >Pushkar</option>\
     </select>";
     document.getElementById("city-data").style.visibility = 'visible';
     document.getElementById("city-data").innerHTML = list4;
     document.getElementById("city").value=row.cells[6].innerHTML;
  }
  else if(document.getElementById("state").value=="Madhya Pradesh"){
    var list4="<select Name=\"city\" id=\"city\" class=\"form-control\">\
     <option value=\"Bhopal\" >Bhopal</option>\
     <option value=\"Indore\" >Indore</option>\
     <option value=\"Ujjain\" >Ujjain</option>\
     </select>";
     document.getElementById("city-data").style.visibility = 'visible';
     document.getElementById("city-data").innerHTML = list4;
     document.getElementById("city").value=row.cells[6].innerHTML;
  }
  
  if(row.cells[7].innerHTML=="Female")
  {
    document.getElementById("female").checked = true;
    document.getElementById("male").checked = false;
  }
  else
  {
    document.getElementById("male").checked = true;
    document.getElementById("female").checked = false;
  }         

  document.getElementById("changes").onclick = function(){ 
    var myData = formValidation();
    myData._id = id;
    console.log("mydata",myData);
    if(myData){
      postRequest("http://localhost:3000/update", myData, function(status,responseText){
        if(status == 200){
          try{
            console.log("response text",responseText);
            var data = JSON.parse(responseText);
            console.log("data of update",data);
            document.getElementById('p3').innerText = "";
            rowdata.cells[2].innerHTML=data.name;
            rowdata.cells[3].innerHTML=data.mobile;
            rowdata.cells[4].innerHTML=data.address;
            rowdata.cells[5].innerHTML=data.state;
            rowdata.cells[6].innerHTML=data.city;
            rowdata.cells[7].innerHTML=data.gender;
            resetFun(); 
            document.getElementById("changes").style.visibility = 'hidden';
            document.getElementById("submit").style.visibility = 'visible';
            document.getElementById("city-data").style.visibility = 'hidden';
          }
          catch(e){
            document.getElementById('p3').innerText = e;
          }
        }else{
          document.getElementById('p3').innerText = "Something went wrong please try again later";
        }
      });
    }  
  }
}
