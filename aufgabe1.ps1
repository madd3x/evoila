<#
    PowerShell

    With a HTTP GET request to the following URL 10 random animals can be requested:
    https://zoo-animal-api.herokuapp.com/animals/rand/10
    
    Please note: 10 is the maximum amount that can be requested.
    

    Please write a PowerShell script that
    - has an input parameter fetchAmount to specify how many animals in total should be received
    - has an input parameter typeFilter to filter animals of a specific type only
    - performs the GET request successively until the number of total animals matches exactly what was specified in parameter fetchAmount
    - creates a CSV file containing the animals data

    Example executions:

    -   ./getAnimals.ps1 -fetchAmount 10 -typeFilter "Mammal"
        Result is a CSV file containing 10 animals of animal_type Mammal

    -   ./getAnimals.ps1 -fetchAmount 100
        Result is a CSV file containing 100 animals of random animal_type

    -   ./getAnimals.ps1
        Result for not specifying any parameters is a CSV file containing 20 animals of random animal_type
        
#>






param
(
[int]$fetchAmount,
[string]$TypeFilter
)

$Result = @()
IF ($fetchAmount -eq ""){$fetchAmount = 20}
IF ($TypeFilter -eq ""){$TypeFilter = "*"}

Do
{ 
    $Response = ConvertFrom-Json -InputObject (Invoke-WebRequest -URI https://zoo-animal-api.herokuapp.com/animals/rand/10)

    Foreach ($Animal in $Response)
    {
        If (($Animal).animal_type -like $TypeFilter) {$Result += $Animal}
        If (($Result).count -eq $fetchAmount) {break}
    }
} while (($Result).count -lt $fetchAmount)

#$Result | Select-Object -Property Name, animal_type
#($Result).count
$Result | Export-CSV C:\temp\getAnimals.csv -force
