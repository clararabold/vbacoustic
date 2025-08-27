Option Explicit
Private IsError As Boolean



''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''            Dialogbox initialisieren                      '''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Public Sub UserForm_Initialize()

    With frmDIN4109_33_Flanken
    
        Bauteildaten_vorhanden = True

        'Tabellenauswahl:

        If Flankentyp = "Metallständerwand" Then
            .frm4109_33_Tab26.Visible = True   'Tabelle26: Flankierende Metallständerwände
            .frm4109_33_Tab26.Top = 10
            .Height = min_(Application.Height - 10, .frm4109_33_Tab26.Height + 40)
            .Width = .frm4109_33_Tab26.Width + 40
            .ScrollHeight = .frm4109_33_Tab26.Height + 20
            
        ElseIf Flankentyp = "Holztafel-/Holzständerwand" Then
            .frm4109_33_Tab27.Visible = True   'Tabelle27: Flankierende Holzständerwände
            .frm4109_33_Tab27.Top = 10
            .frm4109_33_Tab27.Left = 10
            .Height = min_(Application.Height - 10, .frm4109_33_Tab27.Height + 40)
            .Width = .frm4109_33_Tab27.Width + 40
            .ScrollHeight = .frm4109_33_Tab27.Height + 20
            
         ElseIf Flankentyp = "Holzbalkendecke" Or Flankentyp = "Balkenlage-Flachdach" Then
            .frm4109_33_Tab36.Visible = True   'Tabelle27: Flankierende Holzständerwände
            .frm4109_33_Tab36.Top = 10
            .frm4109_33_Tab36.Left = 10
            .Height = min_(Application.Height - 10, .frm4109_33_Tab36.Height + 40)
            .Width = .frm4109_33_Tab36.Width + 40
            .ScrollHeight = .frm4109_33_Tab36.Height + 20
           
        
        Else
            Bauteildaten_vorhanden = False
            .Tag = "0"

        End If
        
'__________________________________________________________________________________________________________________________

        If Application.Width < 1032 Then
            .Top = 0
            .Left = Pos_left
            .Height = Application.Height
         Else
            .Top = 30
            .Left = Pos_left + 300
        End If
        
    End With

    'Darstellung skalieren
    'SetDeviceIndependentWindow Me


End Sub

Private Sub Userform_Activate()

    ' Userform an vorhandene Auflösung anpassen
    'SetDeviceIndependentWindow Me

    'Userform abbrechen wenn keine Daten vorhanden sind
    If Me.Tag = "0" Then
        frmDIN4109_33_Flanken.Hide
        Exit Sub
    End If

End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''            Daten übergeben                                          '''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''            Tabelle 26                                               '''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub optT26Z1_Click()
    'BauteildatenFlanke(Bauteilbezeichnung, Dnfw, TabNr, ZNr)
    IsError = BauteildatenFlanke("B_bGP12_frM50||iMW40_bGP12", 53, 26, 1)
    frmDIN4109_33_Flanken.Hide
End Sub
Private Sub optT26Z2_Click()
    'BauteildatenFlanke(Bauteilbezeichnung, Dnfw, TabNr, ZNr)
    IsError = BauteildatenFlanke("B_bGP12_bGP12_frM50||iMW40_bGP12_bGP12", 56, 26, 2)
    frmDIN4109_33_Flanken.Hide
End Sub
Private Sub optT26Z3_Click()
    'BauteildatenFlanke(Bauteilbezeichnung, Dnfw, TabNr, ZNr)
    IsError = BauteildatenFlanke("B_bGP12_frM100||iMW80_bGP12", 55, 26, 3)
    frmDIN4109_33_Flanken.Hide
End Sub
Private Sub optT26Z4_Click()
    'BauteildatenFlanke(Bauteilbezeichnung, Dnfw, TabNr, ZNr)
    IsError = BauteildatenFlanke("B_bGP12_bGP12_frM100||iMW80_bGP12_bGP12", 59, 26, 4)
    frmDIN4109_33_Flanken.Hide
End Sub
Private Sub optT26Z5_Click()
    'BauteildatenFlanke(Bauteilbezeichnung, Dnfw, TabNr, ZNr)
    IsError = BauteildatenFlanke("B_bGP12_frM50||iMW40_bGP12_getrennt", 57, 26, 5)
    frmDIN4109_33_Flanken.Hide
End Sub
Private Sub optT26Z6_Click()
    'BauteildatenFlanke(Bauteilbezeichnung, Dnfw, TabNr, ZNr)
    IsError = BauteildatenFlanke("B_bGP12_bGP12_frM50||iMW40_bGP12_bGP12_getrennt", 60, 26, 6)
    frmDIN4109_33_Flanken.Hide
End Sub
Private Sub optT26Z7_Click()
    'BauteildatenFlanke(Bauteilbezeichnung, Dnfw, TabNr, ZNr)
    IsError = BauteildatenFlanke("B_bGP12_frM100||iMW80_bGP12_getrennt", 59, 26, 7)
    frmDIN4109_33_Flanken.Hide
End Sub
Private Sub optT26Z8_Click()
    'BauteildatenFlanke(Bauteilbezeichnung, Dnfw, TabNr, ZNr)
    IsError = BauteildatenFlanke("B_bGP12_bGP12_frM100||iMW80_bGP12_bGP12_getrennt", 61, 26, 8)
    frmDIN4109_33_Flanken.Hide
End Sub
Private Sub optT26Z9_Click()
    'BauteildatenFlanke(Bauteilbezeichnung, Dnfw, TabNr, ZNr)
    IsError = BauteildatenFlanke("B_bGP12_frM100||iMW80_bGP12_Inneneckprofil", 65, 26, 9)
    frmDIN4109_33_Flanken.Hide
End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''            Tabelle 27 und Tabelle 28                                '''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub optT27Z1_Click()
    'BauteildatenFlanke(Bauteilbezeichnung, Dnfw, TabNr, ZNr)
    IsError = BauteildatenFlanke("B_bOSB13_frT160||iMW160_bOSB13", 53, 27, 1)
    frmDIN4109_33_Flanken.Hide
End Sub
Private Sub optT27Z2_Click()
    'BauteildatenFlanke(Bauteilbezeichnung, Dnfw, TabNr, ZNr)
    IsError = BauteildatenFlanke("B_bOSB13_frT160||iMW160_bOSB13_getrennt", 58, 27, 2)
    frmDIN4109_33_Flanken.Hide
End Sub
Private Sub optT27Z3_Click()
    'BauteildatenFlanke(Bauteilbezeichnung, Dnfw, TabNr, ZNr)
    IsError = BauteildatenFlanke("B_bOSB13_frT160||iMW160_bOSB13_Wandelemente_getrennt", 68, 27, 3)
    frmDIN4109_33_Flanken.Hide
End Sub
Private Sub optT27Z4_Click()
    'BauteildatenFlanke(Bauteilbezeichnung, Dnfw, TabNr, ZNr)
    IsError = BauteildatenFlanke("B_bOSB13_frT160||iMW160_bOSB13_Wandelemente_verschraubt", 61, 27, 4)
    frmDIN4109_33_Flanken.Hide
End Sub
Private Sub optT27Z5_Click()
    'BauteildatenFlanke(Bauteilbezeichnung, Dnfw, TabNr, ZNr)
    IsError = BauteildatenFlanke("B_bOSB13_frT160||iMW160_bOSB13_Ständer_getrennt", 60, 27, 5)
    frmDIN4109_33_Flanken.Hide
End Sub
Private Sub optT28Z1_Click()
    'BauteildatenFlanke(Bauteilbezeichnung, Dnfw, TabNr, ZNr)
    IsError = BauteildatenFlanke("B_bOSB13_frT160||iMW160_bOSB13_VS_getrennt", 68, 28, 1)
    frmDIN4109_33_Flanken.Hide
End Sub
Private Sub optT28Z2_Click()
    'BauteildatenFlanke(Bauteilbezeichnung, Dnfw, TabNr, ZNr)
    IsError = BauteildatenFlanke("B_bOSB13_frT160||iMW160_bOSB13_VS_durchlaufend", 50, 28, 2)
    frmDIN4109_33_Flanken.Hide
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''            Tabelle 36                                               '''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub optT36Z1_Click()
    'BauteildatenFlanke(Bauteilbezeichnung, Dnfw, TabNr, ZNr)
    IsError = BauteildatenFlanke("", 52, 36, 1)
    frmDIN4109_33_Flanken.Hide
End Sub
Private Sub optT36Z2_Click()
    'BauteildatenFlanke(Bauteilbezeichnung, Dnfw, TabNr, ZNr)
    IsError = BauteildatenFlanke("", 48, 36, 2)
    frmDIN4109_33_Flanken.Hide
End Sub
Private Sub optT36Z3_Click()
    'BauteildatenFlanke(Bauteilbezeichnung, Dnfw, TabNr, ZNr)
    IsError = BauteildatenFlanke("", 54, 36, 3)
    frmDIN4109_33_Flanken.Hide
End Sub
Private Sub optT36Z4_Click()
    'BauteildatenFlanke(Bauteilbezeichnung, Dnfw, TabNr, ZNr)
    IsError = BauteildatenFlanke("", 51, 36, 4)
    frmDIN4109_33_Flanken.Hide
End Sub
Private Sub optT36Z5_Click()
    'BauteildatenFlanke(Bauteilbezeichnung, Dnfw, TabNr, ZNr)
    IsError = BauteildatenFlanke("", 59, 36, 5)
    frmDIN4109_33_Flanken.Hide
End Sub
Private Sub optT36Z6_Click()
    'BauteildatenFlanke(Bauteilbezeichnung, Dnfw, TabNr, ZNr)
    IsError = BauteildatenFlanke("", 60, 36, 6)
    frmDIN4109_33_Flanken.Hide
End Sub
Private Sub optT36Z7_Click()
    'BauteildatenFlanke(Bauteilbezeichnung, Dnfw, TabNr, ZNr)
    IsError = BauteildatenFlanke("", 61, 36, 7)
    frmDIN4109_33_Flanken.Hide
End Sub
Private Sub optT36Z8_Click()
    'BauteildatenFlanke(Bauteilbezeichnung, Dnfw, TabNr, ZNr)
    IsError = BauteildatenFlanke("", 67, 36, 8)
    frmDIN4109_33_Flanken.Hide
End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''   Daten aus Dialogbox in Tabellenblatt übertragen                   '''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Function BauteildatenFlanke(Name As String, Dnfw As Double, TabNr As Integer, ZNr As Integer) As Boolean

    Dim BauteildateninVBAcoustic As String
   
    'Aufruf von BauteildatenFlanke(Bauteilbezeichnung, Dnfw, TabNr, ZNr)in VBAcoustic
    BauteildateninVBAcoustic = VBAcoustic & "!global_Function_Variables.BauteildatenFlanke"
    Application.Run BauteildateninVBAcoustic, Name, Dnfw, TabNr, ZNr, "DIN4109_33_Leichtbauflanken"
     
End Function
