/*
All Negative Scenarios as key value pair for test case generation and test case naming
key is use for naming and value is used to generate test case
*/
negative_data=
        {
            "Null":null,
            "empty":"",
            "alpha_numeric":"12345aasdg",
            "long_int":12342345345345,
            "special_characters":"1237@$@#$",
            "long_string":"fasdkfjjklasdjfkjasdfkj"
        }


/*
Exported Collection from postman is being read here. Collection exported is 'Health_request.json'
*/
var jsonData=require('./Health_request.json')
f_data=Object.assign({},jsonData.item)
jsonData.item=[]
var item_array=f_data[0].item
final_request_item=[]


/*
Used to iterate through all request
*/
for(var i=0;i<item_array.length;i++)
{
    item_array[i].response=[]
    singleAPI(item_array[i])
}
// single_API(item_array[1])//change to make complete 
jsonData.item=final_request_item


/*
Used to write the generated test cases in Json file
*/
const FileSystem = require("fs");
 FileSystem.writeFile('NegativeCollection.json', JSON.stringify(jsonData), (error) => {
    if (error) throw error;
  });


function singleAPI(item)
{
    parameterBodySeparator(item)
}

/*
Used to separate the API which contain body or Parameters 
*/
function parameterBodySeparator(item)
{
    if(item.request.url.hasOwnProperty('query'))
    {
        parameterGenerator(item)
    }
    if(item.request.hasOwnProperty('body'))
    {
        bodyGenerator(item)
    }
}

/*
Will generate all negative test case for all APIs which have parameters
*/
function parameterGenerator(item)
{
    item=removeAPIParameterField(item)
    if(item.request.url.query.length!=0)
    {
        final_request_item.push(parameterFolderGenerator(item))
    }
}

/*
Will generate negative test case for single API and put it in a folder
*/
function parameterFolderGenerator(item)
{
    var multi_req=[]
    var folder={
        "name":generateFolderName(item),
        "item":[]
    }
    parameterIterate(item,multi_req)
    addExtraParameter(item,multi_req)
    folder.item=multi_req
    return folder
}

/*
Will iterate through all parameter in a single API
*/
function parameterIterate(item,multi_req)
{
    for(var i=0;i<item.request.url.query.length;i++)
    {
        singleParameterNegativeTestCaseCreator(i,item,multi_req)
    }
}

/*
Will create multiple negative test case for single Parameter
*/
function singleParameterNegativeTestCaseCreator(i,item,multi_req)
{
    generateNegativeTestCase(i,item,multi_req)
    removeParameterField(i,item,multi_req)
}

/*
Will generate negative test case
*/
function generateNegativeTestCase(field,item,multi_req)
{
   for (const [key, value] of Object.entries(negative_data))
    {
        var temp=[]
        temp=JSON.parse(JSON.stringify(item))
        temp.request.url.query[field].value=""+value
        temp.request.url.raw=""
        temp.name=temp.request.url.query[field].key+" "+key
        multi_req.push(temp)
    }
}

/*
Will remove parameter in the API 
*/
function removeParameterField(i,item,multi_req)
{
    temp=JSON.parse(JSON.stringify(item))
    var fieldname=temp.request.url.query[i].key
    temp.name="Removed Field "+fieldname
    temp.request.url.query[i]={}
    multi_req.push(temp)
}

/*
Will add single extra parameter in the API
*/
function addExtraParameter(item,multi_req)
{
    query={
        "key":"dummy_field",
        "value":"1"
    }
    item.request.url.query.push(query)
    item.name="Extra field  "
    multi_req.push(item)
}

/*
Will remove 'api-version' from all
*/
function removeAPIParameterField(item)
{
    var f_query=[]
    item.request.url.query.forEach(data=>{
        if(data.key!="api-version")
        {
            f_query.push(data)
        }
    })
    item.request.url.query=f_query
    return item
}


/*
Will generate folder name
*/
function generateFolderName(item)
{
    var path=item.request.url.path
    var string_name=""
    path.forEach(element=>{
        string_name=string_name+"/"+element
    })
    return string_name
}

/*
Will generate all negative test case for all APIs which have body
*/
function bodyGenerator(item)
{
    item.request.body.raw=JSON.parse(item.request.body.raw)
    final_request_item.push(bodyFolderGenerator(item))
}

/*
Will generate negative test case for single API and put it in a folder
*/
function bodyFolderGenerator(item)
{
    var multi_req=[]
    var folder={
        "name":generateFolderName(item),
        "item":[]
    }
    bodyFieldIterator(item,multi_req)
    bodyAddExtraField(item,multi_req)
    folder.item=multi_req
    return folder

}

/*
Will iterate through all field of body in a single API
*/
function bodyFieldIterator(item,multi_req)
{
    var body_fields=item.request.body.raw
    for(const[key,value] of Object.entries(body_fields))
    {
        bodySingleFieldNegativeTestCreator(item,multi_req,key)
    }
}

/*
Will create multiple negative test case for single Parameter
*/
function bodySingleFieldNegativeTestCreator(item,multi_req,field)
{
    for (const [key, value] of Object.entries(negative_data))
        {
            var temp=[]
            temp=JSON.parse(JSON.stringify(item))
            temp.request.body.raw[field]=value
            temp.name=field+" "+key
            // console.log(temp.request.body.raw)
            temp.request.body.raw=JSON.stringify(temp.request.body.raw)
            multi_req.push(temp)
        }
        
}
/*
Will add single extra field in body of the API
*/
function bodyAddExtraField(item,multi_req)
{
    var temp=JSON.parse(JSON.stringify(item))
    temp.request.body.raw.dummy=1
    temp.request.body.raw=JSON.stringify(temp.request.body.raw)
    temp.name="Extra field"
    multi_req.push(temp)
}