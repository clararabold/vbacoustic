
Option Explicit
Private IsError As Boolean



Private Sub frmZE_MHD_Click()

End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''            Dialogbox initialisieren                      '''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Public Sub UserForm_Initialize()
    
    With frmDIN4109_33_Decken
    
        Bauteildaten_vorhanden = True

        'Zunächst alles ausblenden
            .frmZE_HBD.Visible = False   'Tabelle 15: Holzbalkendecken mit mineralisch gebundenen Estrichen und Rohdeckenbeschwerung
            .frmTE_HBD.Visible = False   'Tabelle 16: Holzbalkendecken mit Fertigteilestrichen und Rohdeckenbeschwerung
            .frmZE_HBD_L.Visible = False 'Tabelle 17/18: Holzbalkendecken mit Estrichen und Unterdecken an Lattung
            .frmZE_HBD_FS.Visible = False 'Tabelle 20 und 21: Holzbalkendecken mit Zementestrichen und abgehängen Unterdecken
            .frmTE_HBD_FS.Visible = False 'Tabelle 22 u. 23: Holzbalkendecken mit Fertigteilestrichen und abgehängen Unterdecken
            .frmZE_MHD.Visible = False 'Tabelle 24 und 25: Massivholdecke mit Zementestrich
        
        
        'Tabellenauswahl:
        
        If Trenndecke = "offene Holzbalkendecke" And Estrichtyp <> "Trockenestrich" Then
            .frmZE_HBD.Visible = True   'Tabelle 15: Holzbalkendecken mit mineralisch gebundenen Estrichen und Rohdeckenbeschwerung
            .frmZE_HBD.Top = 10
            .frmZE_HBD.Left = 10
            .Height = .frmZE_HBD.Height + 40
            .Width = .frmZE_HBD.Width + 20

        ElseIf Trenndecke = "offene Holzbalkendecke" And Estrichtyp = "Trockenestrich" Then
            .frmTE_HBD.Visible = True   'Tabelle 16: Holzbalkendecken mit Fertigteilestrichen und Rohdeckenbeschwerung
            .frmTE_HBD.Top = 10
            .frmTE_HBD.Left = 10
            .Height = .frmTE_HBD.Height + 40
            .Width = .frmTE_HBD.Width + 20

        ElseIf Trenndecke = "Holzbalkendecke mit Lattung + GK" And Estrichtyp <> "Trockenestrich" Then
            .frmZE_HBD_L.Visible = True 'Tabelle 17/18: Holzbalkendecken mit Estrichen und Unterdecken an Lattung
            .frmZE_HBD_L.Top = 10
            .frmZE_HBD_L.Left = 10
            .Height = .frmZE_HBD_L.Height + 40
            .Width = .frmZE_HBD_L.Width + 20

        ElseIf Trenndecke = "Holzbalkendecke mit Lattung + GK" And Estrichtyp = "Trockenestrich" Then
            .frmTE_HBD_L.Visible = True 'Tabelle 19: Holzbalkendecken mit Fertigteilestrichen und Unterdecken an Lattung
            .frmTE_HBD_L.Top = 10
            .frmTE_HBD_L.Left = 10
            .Height = .frmTE_HBD_L.Height + 40
            .Width = .frmTE_HBD_L.Width + 20

        ElseIf Trenndecke = "Holzbalkendecke mit Abh./FS + 1 x GK" And Estrichtyp <> "Trockenestrich" Then
            .frmZE_HBD_FS.Visible = True 'Tabelle 20 und 21: Holzbalkendecken mit Zementestrichen und abgehängen Unterdecken
            .frmZE_HBD_FS.Top = 10
            .frmZE_HBD_FS.Left = 10
            .Height = min_(Application.Height - 80, .frmZE_HBD_FS.Height + 40)
            .Width = .frmZE_HBD_FS.Width + 30
            .ScrollHeight = .frmZE_HBD_FS.Height + 20

        ElseIf Trenndecke = "Holzbalkendecke mit Abh./FS + 1 x GK" And Estrichtyp = "Trockenestrich" Then
            .frmTE_HBD_FS.Visible = True 'Tabelle 22 u. 23: Holzbalkendecken mit Fertigteilestrichen und abgehängen Unterdecken
            .frmTE_HBD_FS.Top = 10
            .frmTE_HBD_FS.Left = 10
            .Height = min_(Application.Height - 80, .frmTE_HBD_FS.Height + 40)
            .Width = .frmTE_HBD_FS.Width + 20
            .ScrollHeight = .frmTE_HBD_FS.Height + 20
            
        ElseIf Trenndecke = "Massivholzdecke" And Estrichtyp <> "Trockenestrich" Then
            .frmZE_MHD.Visible = True 'Tabelle 24 und 25: Massivholdecke mit Zementestrich
            .frmZE_MHD.Top = 10
            .frmZE_MHD.Left = 10
            .Height = min_(Application.Height - 80, .frmZE_MHD.Height + 40)
            .Width = .frmZE_MHD.Width + 20
            .ScrollHeight = .frmZE_MHD.Height + 20

        Else
            Bauteildaten_vorhanden = False
            .Tag = "0"

        End If

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
        frmDIN4109_33_Decken.Hide
        Exit Sub
    End If
   
End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''            Daten übergeben                                          '''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''            Tabelle 15                                         '''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub optT15Z1_Click()
    IsError = Bauteildaten(47, 70, 15, 1, "", 0, 0) 'Bauteildaten(Lnw, Rw, TabNr, ZNr, biegeweicheBeschwerung?, Deckenmasse, DRUnterdecke)
    frmDIN4109_33_Decken.Hide
End Sub

Private Sub optT15Z2_Click()
    IsError = Bauteildaten(50, 67, 15, 2, "", 0, 0) 'Bauteildaten(Lnw, Rw, TabNr, ZNr, biegeweicheBeschwerung?, Deckenmasse, DRUnterdecke)
    frmDIN4109_33_Decken.Hide
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''            Tabelle 16                                         '''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub optT16Z1_Click()
    IsError = Bauteildaten(54, 65, 16, 1, "", 0, 0) 'Bauteildaten(Lnw, Rw, TabNr, ZNr, biegeweicheBeschwerung?, Deckenmasse, DRUnterdecke)
    frmDIN4109_33_Decken.Hide
End Sub

Private Sub optT16Z2_Click()
    IsError = Bauteildaten(57, 64, 16, 2, "", 0, 0) 'Bauteildaten(Lnw, Rw, TabNr, ZNr, biegeweicheBeschwerung?, Deckenmasse, DRUnterdecke)
    frmDIN4109_33_Decken.Hide
End Sub
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''            Tabelle 17                                         '''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub optT17Z1_Click()
    IsError = Bauteildaten(54, 63, 17, 1, "", 0, 0) 'Bauteildaten(Lnw, Rw, TabNr, ZNr, biegeweicheBeschwerung?, Deckenmasse, DRUnterdecke)
    frmDIN4109_33_Decken.Hide
End Sub
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''            Tabelle 18                                         '''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub optT18Z1_Click()
    IsError = Bauteildaten(48, 65, 18, 1, "", 0, 0) 'Bauteildaten(Lnw, Rw, TabNr, ZNr, biegeweicheBeschwerung?, Deckenmasse, DRUnterdecke)
    frmDIN4109_33_Decken.Hide
End Sub
Private Sub optT18Z2_Click()
    IsError = Bauteildaten(46, 67, 18, 2, "", 0, 0) 'Bauteildaten(Lnw, Rw, TabNr, ZNr, biegeweicheBeschwerung?, Deckenmasse, DRUnterdecke)
    frmDIN4109_33_Decken.Hide
End Sub
Private Sub optT18Z3_Click()
    IsError = Bauteildaten(51, 67, 18, 3, "", 0, 0) 'Bauteildaten(Lnw, Rw, TabNr, ZNr, biegeweicheBeschwerung?, Deckenmasse, DRUnterdecke)
    frmDIN4109_33_Decken.Hide
End Sub
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''            Tabelle 19                                         '''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub optT19Z1_Click()
    IsError = Bauteildaten(55, 61, 19, 1, "", 0, 0) 'Bauteildaten(Lnw, Rw, TabNr, ZNr, biegeweicheBeschwerung?, Deckenmasse, DRUnterdecke)
    frmDIN4109_33_Decken.Hide
End Sub
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''            Tabelle 20                                               '''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub optT20Z1_Click()
    IsError = Bauteildaten(46, 70, 20, 1, "", 0, 0) 'Bauteildaten(Lnw, Rw, TabNr, ZNr, biegeweicheBeschwerung?, Deckenmasse, DRUnterdecke)
    frmDIN4109_33_Decken.Hide
End Sub
Private Sub optT20Z2_Click()
    IsError = Bauteildaten(48, 69, 20, 2, "", 0, 0) 'Bauteildaten(Lnw, Rw, TabNr, ZNr, biegeweicheBeschwerung?, Deckenmasse, DRUnterdecke)
    frmDIN4109_33_Decken.Hide
End Sub
Private Sub optT20Z3_Click()
    IsError = Bauteildaten(50, 70, 20, 3, "", 0, 0) 'Bauteildaten(Lnw, Rw, TabNr, ZNr, biegeweicheBeschwerung?, Deckenmasse, DRUnterdecke)
    frmDIN4109_33_Decken.Hide
End Sub
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''            Tabelle 21                                               '''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub optT21Z1_Click()
    IsError = Bauteildaten(30, 70, 21, 1, "", 0, 0) 'Bauteildaten(Lnw, Rw, TabNr, ZNr, biegeweicheBeschwerung?, Deckenmasse, DRUnterdecke)
    frmDIN4109_33_Decken.Hide
End Sub
Private Sub optT21Z2_Click()
    IsError = Bauteildaten(34, 70, 21, 2, "", 0, 0) 'Bauteildaten(Lnw, Rw, TabNr, ZNr, biegeweicheBeschwerung?, Deckenmasse, DRUnterdecke)
    frmDIN4109_33_Decken.Hide
End Sub
Private Sub optT21Z3_Click()
    IsError = Bauteildaten(36, 68, 21, 3, "", 0, 0) 'Bauteildaten(Lnw, Rw, TabNr, ZNr, biegeweicheBeschwerung?, Deckenmasse, DRUnterdecke)
    frmDIN4109_33_Decken.Hide
End Sub
Private Sub optT21Z4_Click()
    IsError = Bauteildaten(31, 70, 21, 4, "", 0, 0) 'Bauteildaten(Lnw, Rw, TabNr, ZNr, biegeweicheBeschwerung?, Deckenmasse, DRUnterdecke)
    frmDIN4109_33_Decken.Hide
End Sub
Private Sub optT21Z5_Click()
    IsError = Bauteildaten(40, 70, 21, 5, "", 0, 0) 'Bauteildaten(Lnw, Rw, TabNr, ZNr, biegeweicheBeschwerung?, Deckenmasse, DRUnterdecke)
    frmDIN4109_33_Decken.Hide
End Sub
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''            Tabelle 22                                               '''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub optT22Z3_Click()
    IsError = Bauteildaten(56, 63, 22, 3, "", 0, 0) 'Bauteildaten(Lnw, Rw, TabNr, ZNr, biegeweicheBeschwerung?, Deckenmasse, DRUnterdecke)
    frmDIN4109_33_Decken.Hide
End Sub
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''            Tabelle 23                                               '''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub optT23Z1_Click()
    IsError = Bauteildaten(41, 69, 23, 1, "", 0, 0) 'Bauteildaten(Lnw, Rw, TabNr, ZNr, biegeweicheBeschwerung?, Deckenmasse, DRUnterdecke)
    frmDIN4109_33_Decken.Hide
End Sub
Private Sub optT23Z2_Click()
    IsError = Bauteildaten(45, 67, 23, 2, "", 0, 0) 'Bauteildaten(Lnw, Rw, TabNr, ZNr, biegeweicheBeschwerung?, Deckenmasse, DRUnterdecke)
    frmDIN4109_33_Decken.Hide
End Sub
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''            Tabelle 24                                               '''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub optT24Z1_Click()
    IsError = Bauteildaten(56, 62, 24, 1, "nein", 60, 0) 'Bauteildaten(Lnw, Rw, TabNr, ZNr, biegeweicheBeschwerung?, Deckenmasse, DRUnterdecke)
    frmDIN4109_33_Decken.Hide
End Sub
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''            Tabelle 25                                               '''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub optT25Z1_Click()
    IsError = Bauteildaten(45, 70, 25, 1, "nein", 170, 0) 'Bauteildaten(Lnw, Rw, TabNr, ZNr, biegeweicheBeschwerung?, Deckenmasse, DRUnterdecke)
    frmDIN4109_33_Decken.Hide
End Sub
Private Sub optT25Z2_Click()
    IsError = Bauteildaten(46, 68, 25, 2, "ja", 120, 0) 'Bauteildaten(Lnw, Rw, TabNr, ZNr, biegeweicheBeschwerung?, Deckenmasse, DRUnterdecke)
    frmDIN4109_33_Decken.Hide
End Sub
Sub optT25Z3_Click()
    IsError = Bauteildaten(41, 70, 25, 3, "ja", 190, 0) 'Bauteildaten(Lnw, Rw, TabNr, ZNr, biegeweicheBeschwerung?, Deckenmasse, DRUnterdecke)
    frmDIN4109_33_Decken.Hide
End Sub



''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''   Daten aus Dialogbox in Tabellenblatt übertragen                   '''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Function Bauteildaten(Lnw As Double, Rw As Double, TabNr As Integer, ZNr As Integer, biegeweich As String, Deckenmasse As Double, DRUnterdecke As Double) As Boolean

    Dim Bild As String
    Dim Konstruktion As String
    Dim EinfuegeninVBAcoustic As String
    Dim BauteildateninVBAcoustic As String
    Dim DLUnterdecke As Double
    Dim CI50 As Double
    
    
    'Bild- und Konstruktionsbeschreibung mit Tabellen- und Zeilennummer
    Bild = "ImT" & TabNr & "Z" & ZNr
    Konstruktion = "ImKonT" & TabNr & "Z" & ZNr
    
    'Aufruf von Bauteildaten(Lnw, Rw, CI50, TabNr, ZNr, biegeweicheBeschwerung?, Deckenmasse, DRUnterdecke)in VBAcoustic
    CI50 = -1000 'nicht in DIN gelistet
    BauteildateninVBAcoustic = VBAcoustic & "!global_Function_Variables.BauteildatenDecke"
    Application.Run BauteildateninVBAcoustic, Lnw, Rw, CI50, TabNr, ZNr, biegeweich, Deckenmasse, DRUnterdecke, DLUnterdecke, "DIN4109_33_Decken"
    
    'Bild aus Bauteilkatalog suchen und in Tabelle 1 zwischenspeichern
    Workbooks(VBAcoustic).ActiveSheet.ImgBauteilskizze.Picture = CallByName(frmDIN4109_33_Decken, Bild, VbGet).Picture
    
    'Konstruktion aus Bauteilkatalog suchen und in Tabelle 1 zwischenspeichern
    Workbooks(VBAcoustic).ActiveSheet.ImgKonstruktion1.Picture = CallByName(frmDIN4109_33_Decken, Konstruktion, VbGet).Picture
    
    Unload frmDIN4109_33_Decken
    
End Function

