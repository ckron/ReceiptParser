function FetchInputString(x, y)
{
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheets()[0];
  
  let range = sheet.getDataRange();
  let values = range.getValues();
  
  return values[x][y];
}

function PushcellReciptData(id, date, num, name, opt_A, opt_B, opt_C, promotion, string)
{
  let SHOW_NAMES = ["Product_A", "Product_B", "Product_C"];
  
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheets()[0];
  
  for(let i = 0; i < name.length; i++) {
    for(let n = 0; n < SHOW_NAMES.length; n++) {
      if(name[i] === SHOW_NAMES[n]) {
        sheet.appendRow([id, date, num[i], name[i], opt_A[i], opt_B[i], opt_C[i], promotion, string]);
      }
    }
  }
}

//arg ex. "A1" = (0, 0).
function ClearCell(pos)
{
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheets()[0];
  
  let cell = sheet.getRange(pos);

  cell.clearContent();
}

/*
ex. 
-- header --
order ...
... ...
-- body --
?x    Product_A  ...
opt_A
-- footer --
Sales        ...
Promotion        ...
*/
function DivideReceipt(cs)
{
  let ret = [[], [], []];
  
  // v: 0 = header, 1 = body, 2 = footer.
  let v = 0;
  
  for(let i = 0; i < cs.length; i++) {
    let c = cs[i];
    
    if(c.includes("x")) {
      v = 1; 
    } else if(c.includes("Sales")) {
      v = 2;
    }
    
    ret[v].push(c);
  }
  
  return [ret[0], ret[1], ret[2]];
}

//IDは2番目にある.
function AcquireID(header)
{
  let ID_POS = 2;
  return header[ID_POS];
}

//DATEは3番目にある.
function AcquireDate(header)
{
  let DATE_POS = 3;
  return header[DATE_POS];
}

function AcquireMerchandise(body)
{
  //num, name, opt_A, opt_B, opt_C.
  let ret = [[], [], [], [], []];
  
  let counter = -1;
  
  for(let i = 0; i < body.length; i++) {
    let b = body[i];
    
    if(b.includes("x")) {
      counter++;
      ret[0].push(b);
      ret[0][counter] = ret[0][counter].replace(/[x]/g, "");
      if((i+1) !== body.length) {
        ret[1].push(body[i+1]); 
      } else {
        ret[1].push("name error"); 
      }
      
      ret[2].push(0);
      ret[3].push(0);
      ret[4].push(0);
    }
    
    if(b.includes("opt_A")) {
      ret[2][counter] = 1;
    }
    
    if(b.includes("opt_B")) {
      ret[3][counter] = 1; 
    }
    
    if(b.includes("opt_C")) {
      ret[4][counter] = 1; 
    }
  }
  
  return [ret[0], ret[1], ret[2], ret[3], ret[4]];
}

function AcquirePromotion(footer, name)
{
  let promotionPrice = 0;
  
  for(let i = 0; i < footer.length; i++) {
    let f = footer[i];
    
    if(f.includes("Promotion")) {
      if((i+1) !== footer.length) {
        promotionPrice = footer[i+1];
        promotionPrice = promotionPrice.replace(/[()¥]/g, "");
        
        break;
      } else {
        promotionPrice = "promo error"; 
      }
    }
  }
  
  return promotionPrice;  
}

function ReceiptParser()
{
  let string = FetchInputString(0, 0);
  
  let chars = string.split(/[\t\n\s]+/);
  
  let [header, body, footer] = DivideReceipt(chars);
  
  let id = AcquireID(header);
  let date = AcquireDate(header);
  
  let [num, name, opt_A, opt_B, opt_C] = AcquireMerchandise(body);
  
  let promotion = AcquirePromotion(footer, name);
  
  PushcellReciptData(id, date, num, name, opt_A, opt_B, opt_C, promotion, string);
  
  ClearCell("A1");
}