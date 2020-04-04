// search result show function
function myDataget(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() { 
        if (this.readyState == 4 && this.status == 200) {
            var obj=JSON.parse(this.response);
            document.getElementById("btnSearch").disabled = false;
            console.log(obj);
            
            if(obj == "noresult"){
                alert("There is no result.");
                return;
            }
            else{
                // dynamic table producing part
                document.getElementById("mytable").innerHTML = "";
                var para = document.createElement("TR");
                para.innerHTML = "<th>Carrier Name</th><th>Depart Code</th><th>Leaving Time</th><th>yourDestination Code</th><th>Arriving Time</th><th>Price</th>";
                document.getElementById("mytable").appendChild(para);
                for(var i= 0; i < obj.length; i++){
                    var para = document.createElement("TR");
                    para.innerHTML = "<td>" + obj[i].carriername + "</td>" + "<td>" + obj[i].departcode + "</td>"+"<td>" + obj[i].departtime + "</td>"+"<td>" +
                        obj[i].destcode + "</td>"+"<td>" + obj[i].desttime + "</td>"+"<td>" + obj[i].price + "</td>";
                    document.getElementById("mytable").appendChild(para); 
                }
                document.getElementById("btnSearch").disabled = false;
            }
        }   
    };
    xhttp.open("GET", "index.html?name=bb", true);
    xhttp.send();
}

// Search function
function func(){

    //form value validating
    var depart = document.getElementById("dep").value;
    var dest = document.getElementById("des").value;
    if(depart == "" || dest == "" || depart==dest){
        alert("Please check the Airport name.");
        return;
    }

    var dedate = document.getElementById("dedate").value;
    var redate = document.getElementById("redate").value;
    n =  new Date();
    y = n.getFullYear();
    m = n.getMonth() + 1;
    d = n.getDate();
    if(m < 10) m = "0" + m;
    var todaydate = y+"-"+m+"-"+d;
    if(todaydate>dedate || todaydate>redate || dedate>redate || dedate=="" || redate=="")
    {
        alert("Please check the date.");
        return;
    }

    document.getElementById("btnSearch").disabled = true;
    
    // Query producing part
    var departplace = depart.slice(depart.length-3, depart.length);
    var destplace = dest.slice(dest.length-3, dest.length);

    var departdate = dedate.slice(0,4);
    var text1 = departdate.concat("", dedate.slice(5,7));
    departdate = text1.concat("", dedate.slice(8,10));
    
    
    var returndate = redate.slice(0,4);
    var text2 = returndate.concat("", redate.slice(5,7));
    returndate = text2.concat("", redate.slice(8,10));

    var pagequery = "https://www.farecompare.com/results/flights/?flowType=home&quoteKey=C";
    var text3 = pagequery.concat("", departplace);
    
    pagequery = text3.concat("", "C");
    text3 = pagequery.concat("", destplace);
    pagequery = text3.concat("", departdate);
    text3 = pagequery.concat("", "0000R");
    pagequery = text3.concat("", returndate);
    text3 = pagequery.concat("","0000P1ACTF");     

    //communication part
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            setTimeout(myDataget, 35000);
        }
    };
    xhttp.open("GET", "index.html?name=aa&queryurl=" + text3, true);
    xhttp.send();
    var amountLoaded = 0;
    progressBarSim(amountLoaded);
}

// progressbar showing part
function progressBarSim(al){
    var bar = document.getElementById('progressBar');
    var status = document.getElementById('status');
    status.innerHTML = al + "%";
    bar.value = al;
    al++;
    var sim = setTimeout("progressBarSim("+al+")", 340);
    if(al == 100){
        status.innerHTML="100%";
        bar.value = 100;
        clearTimeout(sim);
    }
}