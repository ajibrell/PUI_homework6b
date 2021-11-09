

//creating an array of objects for the inventory to dynamically generate a menu. creating a unique id for each product 
const inventory = [
    {id:1, name: "Original", price:3.00, img:"https://i.ibb.co/dbf4vsT/Cinnamon-bun-new.png", //
        description:"Handcrafted with sweet dough and cinammon-sugar filling.", 
        glazing: ["None","Sugar Milk", "Vanilla Milk","Double chocolate"]}, //a list of four possible values is assigned to the glazing
    {id:2, name: "Blackberry", price:4.00, img:"https://i.ibb.co/RQd7vNH/blackberry.png",
        description:"Handcrafted with sweet dough and cinammon-blackberry filling.", 
        glazing: ["None","Sugar Milk", "Vanilla Milk","Double chocolate"]},
    {id:3, name: "Walnut", price:4.00, img:"https://i.ibb.co/gWdfytb/walnut.png",
        description:"Handcrafted with sweet dough and cinammon-walnut filling.", 
        glazing: ["None","Sugar Milk", "Vanilla Milk","Double chocolate"]},
    {id:4, name: "Original (Gluten-Free)", price:4.00, img:"https://i.ibb.co/dbf4vsT/Cinnamon-bun-new.png", 
        description:"Handcrafted with gluten-free dough and cinammon-sugar filling.", 
        glazing: ["None","Sugar Milk", "Vanilla Milk","Double chocolate"]},
    {id:5, name: "Pumpkin Spice", price:4.00, img:"https://i.ibb.co/02PYnYw/pumpkin-spice1.jpg", 
        description:"Handcrafted with sweet dough and pumpkin-sugar filling.", 
        glazing: ["None","Sugar Milk", "Vanilla Milk","Double chocolate"]},
    {id:6, name: "Caramel Pecan", price:3.00, img:"https://i.ibb.co/QKQWwDn/carmel-pecan1.jpg", 
        description:"Handcrafted with sweet dough and caramel pecan filling.", 
        glazing: ["None","Sugar Milk", "Vanilla Milk","Double chocolate"]},

];

var GV_CART=[]; //empty array
var GV_ITEM={}; //declaring as an empty object
function loadCart(){  // load cart from local storage
    const shoppingCart = localStorage.getItem("ShoppingCart"); //getting out of local storage as a string
    //  alert(shoppingCart);
      if (shoppingCart) // if there is a shopping cart in local storage.
      {
          GV_CART = JSON.parse(shoppingCart); // convert JSON String to actual JavaScript Array of Objects.
      //    alert(shoppingCart);
      }
      else {// if there's nothing found in local storage
          return 0;//then return 0
      }
      document.getElementById("cart-items").innerHTML = GV_CART.length;  // take the length of the array and add to the span to display number of items in cart.
      return GV_CART.length;
}
function indexLoad () // called from index.html body.onload.
{
    loadCart();   
}
function getCart ()  // called from cart.html body.onload. gets shopping cart out of local storage
{ //builds the items in cart for display
    loadCart();
   
    let trStart = '<tr><td><div class="cart-content">'; //taking the start of each row
    let content=""; // dynamic content for table in cart.html
    let subTotal=0; // to add up all the costs for each item.
   
   // for (let i=0;i<GV_CART.length;i++)
   for (let i in GV_CART) // loop through the cart array
    {
        const cart = GV_CART[i]; 
      
        const item = getItemById(cart.itemId); //pulls the item out of the inventory array based on the inidividual itemId in cart

        //console.log (item);
        let price = "$" + item.price+".00"; // formatted price for output.
        subTotal += (cart.price * cart.quantity);// add up all the costs
        let cost = "$"+(cart.price * cart.quantity)+".00"; // formated costs for output.
        let row =`${trStart}<img src="${item.img}" alt="${item.name}"><div><p>${item.name}</p><p>Glazing: ${cart.glazing}</p><br><p>Price: ${price}</p><br>`;// embedding trStart variable in a string ${variable name}, back tick allows you to embed JS variable into a string
        
       // let row=trStart+"<img src='"+item.img+"' alt ='"+item.name+"'><div><p>"+item.name+"</p><p>Glazing: "+cart.glazing+"</p>br><p>Price: $"+price+"</p><br>";
        
        row += `<a href="javascript:deleteFromCart(${i})">Delete Item</a></div></div></td><td>${cart.quantity}</td><td>${cost}</td></tr>`;
        //adding more content to the row. javascript:deleteFromCart calls a function when 'Delete Item' is clicked on the seleted item in the gv_cart array.
        
        content+=row;//storing the rows in the content variable
    }
    document.getElementById("cartList").innerHTML=   content;    //dynamically injecting content, created by the for loop, into table body 
    document.getElementById("subTotal").innerHTML=   "$"+subTotal+".00";   //inserts subtotal 
    const salesTax = subTotal * .06; // calculates the sales tax
    const total = subTotal+salesTax; //calculates total 
    document.getElementById("taxAmount").innerHTML=   "$"+salesTax;  // injecting sales tax into table cell
    document.getElementById("totalSaleAmount").innerHTML=   "$"+total;  // injecting total bill into totalSaleAmount cell
}
function deleteFromCart(indexToDelete)
{
    let newCart=[] // create a new empty cart
    for (let i in GV_CART) //loop through the existing cart
    {
        if (i != indexToDelete)//when you click "Delete Item" checks if the index of that item is equal to the passed in index or index of item to delete 
        {
            newCart.push (GV_CART[i]);//then add to new cart all items except the one to delete.
        }
    }
    GV_CART=newCart;  // replace current cart with new cart that has all items except the deleted item.
    localStorage.setItem("ShoppingCart", JSON.stringify(GV_CART)); // save updated cart in local storage.
    getCart(); // reload cart and refresh page.
}
function getDetails()
{
    // Query String:   bunbun-bakeshop/detail.html?id=1
    const id = parseInt((window.location.href).split("id=")[1]); // id from the query string. everything to left of token is index 0, and everything to the right of the token is index 1. this is splitting a string based on the token "id="
    
    const item = getItemById(id);//pulls item out of the inventory array based on id and stores in GV_ITEM
    GV_ITEM=item;// store in global variable GV_ITEM for later use such as adding to cart.
    console.log(item);
    let options = "";// dynamucally build options for glazing drop down list.
    const glazings = item.glazing; // get glazing array from item.
    for (let i in glazings) // loop through glazing array.
    {
        options += "<option>"+glazings[i]+"</option>"; // build options
    }
    document.getElementById("glazingList").innerHTML=options; // inject options into HTML Select for id = glazingList
    document.getElementById("itemPrice").innerHTML="$"+item.price+".00";
    document.getElementById("itemDescription").innerHTML=item.description;
   // alert(item.description);
    document.getElementById("itemName").innerHTML=item.name;

    loadCart();
   // alert(id);
}
function getItemById (id)
{
    for (let i in inventory) { // loop through item array to find item based on id.
        if (inventory[i].id==id) // if the id at this row is equal the passed in id of item we want return it
            return inventory[i]; // this is the item we want, return it.
    }
}
//dynamically builds the menu page
function displayProducts () // called from menu.html body.load event.
{
    let list = "";  // dynamically build product list
    for (let i in inventory) {  // loop through inventory array.
        const item = inventory[i]; // get each item for display
        // dynamically build row for table.
        let row = '<div class="menu-column"> <img id="original-bun" src="' +item.img+'" width="80%" height="80%">';
        const price = "$"+item.price+".00"; // formatted price.
        const det = `<h3>${item.name}</h3><p>${price}</p><a href="detail.html?id=${item.id}" class="purple-button">View Item</a> </div>`;
        row =row+det;  // combine row parts
        //console.log(row);
        list+=row;  // add row to list.
    }
    console.log(list);
    document.getElementById("divProductList").innerHTML=list; // injected dynamically built list into menu.html for id = divProductList
}
// Change product details after a choice is selected
//Source:https://stackoverflow.com/questions/1085801/get-selected-value-in-dropdown-list-using-javascript?rq=1
function updateGlaze() {  // called from glaze drop down.
    var glazing = document.querySelector(".glazing");
    if (glazing != undefined) {
        var glazeText = glazing.options[glazing.selectedIndex].text; // get glaze from drop down list
      document.getElementById("glazingType").innerHTML = "<b>Glaze:</b>" + ' ' + glazeText; // puts in right side panel.
    } 
}
   

function updateQuantity() {  // called from quantity drop down.
    var quantity = document.querySelector(".quantity"); // get reference to drop down for quanity.
    if (quantity != undefined) {
        var priceText = quantity.options[quantity.selectedIndex].text; // get text from quanity drop down.
        const qty = parseInt(priceText); // convert to integer
        const saleTotal = GV_ITEM.price * qty; // calculate sub total
        document.getElementById("bunQuantity").innerHTML = "<b>Quantity:</b>" + ' ' + priceText; // put quanity in right side panel
        document.getElementById("saleTotal").innerHTML = "<b>Sale Total:</b>" + ' $' + saleTotal+".00"; // put sub total in right side panel
        
    }
}

/*Attempt at updating the shopping cart*/

function addToCart() { // called by add to cart link in detail.html  
  //  var cartTotal = document.querySelector(".purple-button add-to-cart");
   // alert(cartTotal);
   // if (cartTotal) {
      //  var cartText = cartTotal.options[cartTotal.selectedIndex].text;
        const glazingIndex = document.getElementById("glazingList").selectedIndex; // index of selected glaze in drop dwon
        const qty = document.getElementById("selectQuanity").value;// index of selected quantity in drop dwon

        // below create a cart object to add to the cart array
        const item ={itemId: GV_ITEM.id, price: GV_ITEM.price, quantity:qty, glazing: GV_ITEM.glazing[glazingIndex]};
      //  console.log(item);
        //alert("adding");
        GV_CART.push(item); //push the item onto the cart
        localStorage.setItem("ShoppingCart", JSON.stringify(GV_CART));//now save to local storage - local memory has to be stored in string
        document.getElementById("cart-items").innerHTML = GV_CART.length;//update cart count
        alert("Added to cart");
    //}
}



