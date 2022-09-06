/*
JavaScript

Variable hostsString contains information about Hosts and how many free resources they have (cpu, memory, storage).
Variable vmsString contains information about VMs and how many resources they are using.

Please write a script that
- generates objects (hosts, vms) from the JSON String variables (hostsString, vmsString)
- completes the information of the VMs:
  - the Host on which each VM should be running must be determined based on the specified resource information and then the VM attribute "host" should be set with that hosts name.
  - if the name of a VM is valid as defined by the rules below, the VM attribute "isValid" should be set to true. If the name is not valid, "isValid" should be set to false.

Rules for valid VM names:
- name begins with evo
- then there should be a 4-digit number, e.g. 1122
- after that there are 4 alphabetical characters (a-z or A-Z), e.g. aBcD
- at the end, there can be either one single digit or a 2-digit number, e.g. 5 or 55
- all of those blocks are separated with -

    
console.log(vms) would show something like this after the script execution:
    
    [ { name: 'evo-2021-dEFg-20',
    isValid: true,
    host: 'evoesx01',
    cpuMHz: 1000,
    memoryMB: 2000,
    storageMB: 10000 },
    { name: 'evo-0000-ABCd-0',
    isValid: true,
    host: 'evoesx03',
    cpuMHz: 1000,
    memoryMB: 2000,
    storageMB: 10000 },
    { name: 'evo-2020-abcd-1',
    isValid: true,
    host: 'evoesx04',
    cpuMHz: 800,
    memoryMB: 4000,
    storageMB: 8000 },
    { name: 'aevo-2020-abcd-20',
    isValid: false,
    host: 'evoesx04',
    cpuMHz: 1000,
    memoryMB: 2000,
    storageMB: 10000 },
    { name: 'evo-20202-abcd-2',
    isValid: false,
    host: 'evoesx04',
    cpuMHz: 1000,
    memoryMB: 2000,
    storageMB: 10000 },
    { name: 'evo-2020-ABcd-202',
    isValid: false,
    host: 'evoesx04',
    cpuMHz: 1000,
    memoryMB: 2000,
    storageMB: 10000 } ]    
    
    
    
Useful Links:
- https://regex101.com/
- https://jsoneditoronline.org/

For developing you can use this: https://runjs.app/

*/

var hostsString = '[{"name":"evoesx01","cpuAvailableGHz":1,"memAvailableGB":5,"storageAvailableGB":10},{"name":"evoesx02","cpuAvailableGHz":3,"memAvailableGB":1,"storageAvailableGB":1},{"name":"evoesx03","cpuAvailableGHz":3,"memAvailableGB":3,"storageAvailableGB":20},{"name":"evoesx04","cpuAvailableGHz":100,"memAvailableGB":100,"storageAvailableGB":100}]'
var vmsString = '[{"name":"evo-2021-dEFg-20","isValid":null,"host":null,"cpuMHz":1000,"memoryMB":2000,"storageMB":10000},{"name":"evo-0000-ABCd-0","isValid":null,"host":null,"cpuMHz":1000,"memoryMB":2000,"storageMB":10000},{"name":"evo-2020-abcd-1","isValid":null,"host":null,"cpuMHz":800,"memoryMB":4000,"storageMB":8000},{"name":"aevo-2020-abcd-20","isValid":null,"host":null,"cpuMHz":1000,"memoryMB":2000,"storageMB":10000},{"name":"evo-20202-abcd-2","isValid":null,"host":null,"cpuMHz":1000,"memoryMB":2000,"storageMB":10000},{"name":"evo-2020-ABcd-202","isValid":null,"host":null,"cpuMHz":1000,"memoryMB":2000,"storageMB":10000}]'

// einfaches lineares auffüllen von vms auf hosts nach vorgebener Reihenfolge unter beachtung der ressourcen limits

var hosts = JSON.parse(hostsString)
var vms = JSON.parse(vmsString)
var passt = false
var aktCPU = []
var aktRAM = []
var aktHDD = []



for (let h = 0; h < hosts.length; h++) {

	//initialisieren der 'Zähler' für jeden Host
	aktCPU[h] = 0
	aktRAM[h] = 0
	aktHDD[h] = 0

	for (let v = 0; v < vms.length; v++) {

		passt = passtaufHost(vms[v],hosts[h],aktCPU[h],aktRAM[h],aktHDD[h])	

		if ((passt) && (vms[v]["host"]==null)) {

			vms[v]["host"] = hosts[h]["name"]			
			aktCPU[h] = aktCPU[h] + vms[v]["cpuMHz"]
			aktRAM[h] = aktRAM[h] + vms[v]["memoryMB"]
			aktHDD[h] = aktHDD[h] + vms[v]["storageMB"]

			console.log(hosts[h]["name"],vms[v]["name"], aktCPU[h],aktRAM[h],aktHDD[h]);

		}
		vms[v]["isValid"] = checkname(vms[v]["name"]);
	}
}
console.log(vms); //Zeige Arrays mit VMS

function checkname(vmName) {                                              //- all of those blocks are separated with -
	//regex herstellen und auf vm namen testen
	var rulePattern1 = "^[e][v][o][-]"                                      //- name begins with evo
	var rulePattern2 = "[0-9][0-9][0-9][0-9][-]"                            //- then there should be a 4-digit number, e.g. 1122
	var rulePattern3 = "[a-zA-Z][a-zA-Z][a-zA-Z][a-zA-Z][-]"                //- after that there are 4 alphabetical characters (a-z or A-Z), e.g. aBcD
	var rulePattern4 = "[0-9]{1,2}$"                                        //- at the end, there can be either one single digit or a 2-digit number, e.g. 5 or 55
	var regexpr = new RegExp(rulePattern1+rulePattern2+rulePattern3+rulePattern4)
	return regexpr.test(vmName);
};

function passtaufHost(objVM,objHOST,standCPU,standRAM,standHDD) {
   // Prüft ob vm auf den host passt
   let answer = (
                 ((calcGbToMB(objHOST["cpuAvailableGHz"]) - standCPU) >= objVM["cpuMHz"]) && 
                 ((calcGbToMB(objHOST["memAvailableGB"]) - standRAM) >= objVM["memoryMB"]) &&
                 ((calcGbToMB(objHOST["storageAvailableGB"]) - standHDD) >= objVM["storageMB"])
                );
   return answer;
};

function calcGbToMB(valGB) {
  //umrechnen GB zu MB
  return valGB * 1024
};

