Option Explicit
Private IsError As Boolean

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''            Dialogbox initialisieren                      '''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Public Sub UserForm_Initialize()

    With frmDIN4109_33_Waende
    
        Bauteildaten_vorhanden = True

        'Tabellenauswahl:

        If Wandtyp = "Metallständerwand" Then
            .frm4109_33_Tab2.Visible = True   'Tabelle2: Metallständerwände
            .frm4109_33_Tab2.Top = 10
            .Height = .frm4109_33_Tab2.Height + 40
            .Width = .frm4109_33_Tab2.Width + 20
            .ScrollHeight = .frm4109_33_Tab2.Height + 20
            
'__________________________________________________________________________________________________________________________
        
'        ElseIf frmVBAcousticTrennwand.cboWandtyp_Holz = "Holzrahmenbau Innenwände ohne Installationse." Then
'
'            .frm4109_33_Tab3.Visible = True   'Tabelle3: Innenwände in Holzrahmenbauweise ohne Installationsebene
'            .frm4109_33_Tab3.Top = frmVBAcousticTrennwand.Top
'            .frm4109_33_Tab3.Left = 10
'            .Height = min_(Application.Height - 80, .frm4109_33_Tab3.Height + 40)
'            .Width = .frm4109_33_Tab3.Width + 30
'            .ScrollHeight = .frm4109_33_Tab3.Height + 20
''__________________________________________________________________________________________________________________________
'
'        ElseIf frmVBAcousticTrennwand.cboWandtyp_Holz = "Holzrahmenbau Innenwände mit Installationse." Then
'            .frm4109_33_Tab4.Visible = True   'Tabelle4: Innenwände in Holzrahmenbauweise mit Installationsebene
'            .frm4109_33_Tab4.Top = frmVBAcousticTrennwand.Top
'            .frm4109_33_Tab4.Left = 10
'
'            .Height = min_(Application.Height - 80, .frm4109_33_Tab4.Height + 40)
'            .Width = .frm4109_33_Tab4.Width + 30
'            .ScrollHeight = .frm4109_33_Tab4.Height + 20
'
''__________________________________________________________________________________________________________________________
'
'        ElseIf frmVBAcousticTrennwand.cboWandtyp_Holz = "Holzrahmenbau Gebäudetrennwände" Then
'            .frm4109_33_Tab5.Visible = True   'Tabelle5: Gebäudetrennwände in Holzrahmenbauweise
'            .frm4109_33_Tab5.Top = frmVBAcousticTrennwand.Top
'            .frm4109_33_Tab5.Left = 10
'
'            .Height = min_(Application.Height - 80, .frm4109_33_Tab5.Height + 40)
'            .Width = .frm4109_33_Tab5.Width + 30
'            .ScrollHeight = .frm4109_33_Tab5.Height + 20
'
''__________________________________________________________________________________________________________________________
'
'        ElseIf frmVBAcousticTrennwand.cboWandtyp_Holz = "Holzrahmenbau Außenwände ohne Inastallationse." Then
'            .frm4109_33_Tab6.Visible = True   'Tabelle6: Außenwänden in Holzrahmenbauweise ohne raumseitige Installationsebene
'            .frm4109_33_Tab6.Top = frmVBAcousticTrennwand.Top
'            .frm4109_33_Tab6.Left = 10
'
'            .Height = min_(Application.Height - 80, .frm4109_33_Tab6.Height + 40)
'            .Width = .frm4109_33_Tab6.Width + 30
'            .ScrollHeight = .frm4109_33_Tab6.Height + 20
'
''__________________________________________________________________________________________________________________________
'
'        ElseIf frmVBAcousticTrennwand.cboWandtyp_Holz = "Holzrahmenbau Außenwände mit Installationse." Then
'            .frm4109_33_Tab7.Visible = True   'Tabelle7: Außenwänden in Holzrahmenbauweise mit raumseitige Installationsebene
'            .frm4109_33_Tab7.Top = frmVBAcousticTrennwand.Top
'            .frm4109_33_Tab7.Left = 10
'
'            .Height = min_(Application.Height - 80, .frm4109_33_Tab7.Height + 40)
'            .Width = .frm4109_33_Tab7.Width + 30
'            .ScrollHeight = .frm4109_33_Tab7.Height + 20
'
''__________________________________________________________________________________________________________________________
'
'        ElseIf frmVBAcousticTrennwand.cboWandtyp_Holz = "Massivholzbauwände" Then
'            .frm4109_33_Tab8.Visible = True   'Tabelle8: Massivholzwände
'            .frm4109_33_Tab8.Top = frmVBAcousticTrennwand.Top
'            .frm4109_33_Tab8.Left = 10
'
'            .Height = min_(Application.Height - 80, .frm4109_33_Tab8.Height + 40)
'            .Width = .frm4109_33_Tab8.Width + 20
'            .ScrollHeight = .frm4109_33_Tab8.Height + 20
''__________________________________________________________________________________________________________________________
        
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
        frmDIN4109_33_Waende.Hide
        Exit Sub
    End If

End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''            Daten übergeben                                          '''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''            Tabelle 2                                                '''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub optT2Z1_Click()
    'BauteildatenWand(Bauteilbezeichnung, Rw, C50, Ctr50, TabNr, ZNr, Wandelementmasse+Beplankung, Rsw, DRw_SR, DRw_ER)
    IsError = BauteildatenWand("B_bGP12_frM50||iMW40_bGP12", 41, "nv", "nv", 2, 1, "nv", "nv", "nv", "nv")
    frmDIN4109_33_Waende.Hide
End Sub

Private Sub optT2Z2_Click()
    'BauteildatenWand(Bauteilbezeichnung, Rw, C50, Ctr50, TabNr, ZNr, Wandelementmasse+Beplankung, Rsw, DRw_SR, DRw_ER)
    IsError = BauteildatenWand("B_bGP12_frM75||iMW60_bGP12", 42, "nv", "nv", 2, 2, "nv", "nv", "nv", "nv")
    frmDIN4109_33_Waende.Hide
End Sub

Private Sub optT2Z3_Click()
    'BauteildatenWand(Bauteilbezeichnung, Rw, C50, Ctr50, TabNr, ZNr, Wandelementmasse+Beplankung, Rsw, DRw_SR, DRw_ER)
    IsError = BauteildatenWand("B_bGP12_frM100||iMW40_bGP12", 43, "nv", "nv", 2, 3, "nv", "nv", "nv", "nv")
    frmDIN4109_33_Waende.Hide
End Sub

Private Sub optT2Z4_Click()
    'BauteildatenWand(Bauteilbezeichnung, Rw, C50, Ctr50, TabNr, ZNr, Wandelementmasse+Beplankung, Rsw, DRw_SR, DRw_ER)
    IsError = BauteildatenWand("B_bGP12_frM100||iMW60_bGP12", 44, "nv", "nv", 2, 4, "nv", "nv", "nv", "nv")
    frmDIN4109_33_Waende.Hide
End Sub

Private Sub optT2Z5_Click()
    'BauteildatenWand(Bauteilbezeichnung, Rw, C50, Ctr50, TabNr, ZNr, Wandelementmasse+Beplankung, Rsw, DRw_SR, DRw_ER)
    IsError = BauteildatenWand("B_bGP12_frM100||iMW80_bGP12", 45, "nv", "nv", 2, 5, "nv", "nv", "nv", "nv")
    frmDIN4109_33_Waende.Hide
End Sub

Private Sub optT2Z6_Click()
    'BauteildatenWand(Bauteilbezeichnung, Rw, C50, Ctr50, TabNr, ZNr, Wandelementmasse+Beplankung, Rsw, DRw_SR, DRw_ER)
    IsError = BauteildatenWand("B_bGP12_bGP12_frM50||iMW40_bGP12_bGP12", 48, "nv", "nv", 2, 6, "nv", "nv", "nv", "nv")
    frmDIN4109_33_Waende.Hide
End Sub

Private Sub optT2Z7_Click()
    'BauteildatenWand(Bauteilbezeichnung, Rw, C50, Ctr50, TabNr, ZNr, Wandelementmasse+Beplankung, Rsw, DRw_SR, DRw_ER)
    IsError = BauteildatenWand("B_bGP12_bGP12_frM75||iMW40_bGP12_bGP12", 48, "nv", "nv", 2, 7, "nv", "nv", "nv", "nv")
    frmDIN4109_33_Waende.Hide
End Sub

Private Sub optT2Z8_Click()
    'BauteildatenWand(Bauteilbezeichnung, Rw, C50, Ctr50, TabNr, ZNr, Wandelementmasse+Beplankung, Rsw, DRw_SR, DRw_ER)
    IsError = BauteildatenWand("B_bGP12_bGP12_frM75||iMW60_bGP12_bGP12", 51, "nv", "nv", 2, 8, "nv", "nv", "nv", "nv")
    frmDIN4109_33_Waende.Hide
End Sub

Private Sub optT2Z9_Click()
    'BauteildatenWand(Bauteilbezeichnung, Rw, C50, Ctr50, TabNr, ZNr, Wandelementmasse+Beplankung, Rsw, DRw_SR, DRw_ER)
    IsError = BauteildatenWand("B_bGP12_bGP12_frM100||iMW40_bGP12_bGP12", 49, "nv", "nv", 2, 9, "nv", "nv", "nv", "nv")
    frmDIN4109_33_Waende.Hide
End Sub

Private Sub optT2Z10_Click()
    'BauteildatenWand(Bauteilbezeichnung, Rw, C50, Ctr50, TabNr, ZNr, Wandelementmasse+Beplankung, Rsw, DRw_SR, DRw_ER)
    IsError = BauteildatenWand("B_bGP12_bGP12_frM100||iMW60_bGP12_bGP12", 51, "nv", "nv", 2, 10, "nv", "nv", "nv", "nv")
    frmDIN4109_33_Waende.Hide
End Sub

Private Sub optT2Z11_Click()
    'BauteildatenWand(Bauteilbezeichnung, Rw, C50, Ctr50, TabNr, ZNr, Wandelementmasse+Beplankung, Rsw, DRw_SR, DRw_ER)
    IsError = BauteildatenWand("B_bGP12_bGP12_frM100||iMW80_bGP12_bGP12", 52, "nv", "nv", 2, 11, "nv", "nv", "nv", "nv")
    frmDIN4109_33_Waende.Hide
End Sub

Private Sub optT2Z12_Click()
    'BauteildatenWand(Bauteilbezeichnung, Rw, C50, Ctr50, TabNr, ZNr, Wandelementmasse+Beplankung, Rsw, DRw_SR, DRw_ER)
    IsError = BauteildatenWand("B_bGP12_bGP12_frM50||iMW40_ac5_frM50||iMW40_bGP12_bGP12", 60, "nv", "nv", 2, 12, "nv", "nv", "nv", "nv")
    frmDIN4109_33_Waende.Hide
End Sub

Private Sub optT2Z13_Click()
    'BauteildatenWand(Bauteilbezeichnung, Rw, C50, Ctr50, TabNr, ZNr, Wandelementmasse+Beplankung, Rsw, DRw_SR, DRw_ER)
    IsError = BauteildatenWand("B_bGP12_bGP12_frM100||iMW80_ac5_frM100||iMW80_bGP12_bGP12", 61, "nv", "nv", 2, 13, "nv", "nv", "nv", "nv")
    frmDIN4109_33_Waende.Hide
End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''            Tabelle 3                                                '''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Private Sub optT3Z1_Click()
'    IsError = Bauteildaten(38, 3, 1) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT3Z2_Click()
'    IsError = Bauteildaten(42, 3, 2) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT3Z3_Click()
'    IsError = Bauteildaten(34, 3, 3) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT3Z4_Click()
'    IsError = Bauteildaten(40, 3, 4) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT3Z5_Click()
'    IsError = Bauteildaten(41, 3, 5) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT3Z6_Click()
'    IsError = Bauteildaten(44, 3, 6) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT3Z7_Click()
'    IsError = Bauteildaten(36, 3, 7) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT3Z8_Click()
'    IsError = Bauteildaten(43, 3, 8) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT3Z9_Click()
'    IsError = Bauteildaten(47, 3, 9) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT3Z10_Click()
'    IsError = Bauteildaten(48, 3, 10) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT3Z11_Click()
'    IsError = Bauteildaten(47, 3, 11) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT3Z12_Click()
'    IsError = Bauteildaten(47, 3, 12) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT3Z13_Click()
'    IsError = Bauteildaten(43, 3, 13) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT3Z14_Click()
'    IsError = Bauteildaten(54, 3, 14) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT3Z15_Click()
'    IsError = Bauteildaten(54, 3, 15) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT3Z16_Click()
'    IsError = Bauteildaten(66, 3, 16) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT3Z17_Click()
'    IsError = Bauteildaten(43, 3, 17) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT3Z18_Click()
'    IsError = Bauteildaten(45, 3, 18) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT3Z19_Click()
'    IsError = Bauteildaten(58, 3, 19) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''            Tabelle 4                                                '''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Private Sub optT4Z1_Click()
'    IsError = Bauteildaten(54, 4, 1) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT4Z2_Click()
'    IsError = Bauteildaten(56, 4, 2) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT4Z3_Click()
'    IsError = Bauteildaten(60, 4, 3) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT4Z4_Click()
'    IsError = Bauteildaten(61, 4, 4) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT4Z5_Click()
'    IsError = Bauteildaten(60, 4, 5) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT4Z6_Click()
'    IsError = Bauteildaten(60, 4, 6) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'
'
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''            Tabelle 5                                                '''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Private Sub optT5Z1_Click()
'    IsError = Bauteildaten(70, 5, 1) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT5Z2_Click()
'    IsError = Bauteildaten(70, 5, 2) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT5Z3_Click()
'    IsError = Bauteildaten(69, 5, 3) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT5Z4_Click()
'    IsError = Bauteildaten(66, 5, 4) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT5Z5_Click()
'    IsError = Bauteildaten(66, 5, 5) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT5Z6_Click()
'    IsError = Bauteildaten(75, 5, 6) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT5Z7_Click()
'    IsError = Bauteildaten(72, 5, 7) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'
'
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''            Tabelle 6                                                '''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Private Sub optT6Z1_Click()
'    IsError = Bauteildaten(37, 6, 1) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT6Z2_Click()
'    IsError = Bauteildaten(41, 6, 2) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT6Z3_Click()
'    IsError = Bauteildaten(37, 6, 3) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT6Z4_Click()
'    IsError = Bauteildaten(44, 6, 4) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT6Z5_Click()
'    IsError = Bauteildaten(44, 6, 5) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT6Z6_Click()
'    IsError = Bauteildaten(45, 6, 6) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT6Z7_Click()
'    IsError = Bauteildaten(46, 6, 7) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT6Z8_Click()
'    IsError = Bauteildaten(49, 6, 8) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT6Z9_Click()
'    IsError = Bauteildaten(50, 6, 9) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT6Z10_Click()
'    IsError = Bauteildaten(50, 6, 10) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT6Z11_Click()
'    IsError = Bauteildaten(52, 6, 11) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT6Z12_Click()
'    IsError = Bauteildaten(44, 6, 12) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'
'
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''            Tabelle 7                                                '''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Private Sub optT7Z1_Click()
'    IsError = Bauteildaten(52, 7, 1) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT7Z2_Click()
'    IsError = Bauteildaten(51, 7, 2) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT7Z3_Click()
'    IsError = Bauteildaten(48, 7, 3) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'
'
'
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''            Tabelle 8                                                '''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Private Sub optT8Z1_Click()
'    IsError = Bauteildaten(74, 8, 1) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT8Z2_Click()
'    IsError = Bauteildaten(67, 8, 2) 'Bauteildaten(Rw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'
'
'
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''            Tabelle 26                                                '''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'
'Private Sub optT26Z1_Click()
'    IsError = Bauteildaten(53, 26, 1) 'Bauteildaten(Dn,fw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT26Z2_Click()
'    IsError = Bauteildaten(56, 26, 2) 'Bauteildaten(Dn,fw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT26Z3_Click()
'    IsError = Bauteildaten(55, 26, 3) 'Bauteildaten(Dn,fw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT26Z4_Click()
'    IsError = Bauteildaten(59, 26, 4) 'Bauteildaten(Dn,fw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT26Z5_Click()
'    IsError = Bauteildaten(57, 26, 5) 'Bauteildaten(Dn,fw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT26Z6_Click()
'    IsError = Bauteildaten(60, 26, 6) 'Bauteildaten(Dn,fw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT26Z7_Click()
'    IsError = Bauteildaten(59, 26, 7) 'Bauteildaten(Dn,fw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT26Z8_Click()
'    IsError = Bauteildaten(61, 26, 8) 'Bauteildaten(Dn,fw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT26Z9_Click()
'    IsError = Bauteildaten(65, 26, 9) 'Bauteildaten(Dn,fw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''            Tabelle 27                                                '''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'
'Private Sub optT27Z1_Click()
'    IsError = Bauteildaten(53, 27, 1) 'Bauteildaten(Dn,fw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT27Z2_Click()
'    IsError = Bauteildaten(58, 27, 2) 'Bauteildaten(Dn,fw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'Private Sub optT27Z3_Click()
'    IsError = Bauteildaten(68, 27, 3) 'Bauteildaten(Dn,fw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'Private Sub optT27Z4_Click()
'    IsError = Bauteildaten(61, 27, 4) 'Bauteildaten(Dn,fw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'Private Sub optT27Z5_Click()
'    IsError = Bauteildaten(60, 27, 5) 'Bauteildaten(Dn,fw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''            Tabelle 28                                                '''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'
'Private Sub optT28Z1_Click()
'    IsError = Bauteildaten(68, 28, 1) 'Bauteildaten(Dn,fw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'Private Sub optT28Z2_Click()
'    IsError = Bauteildaten(50, 28, 2) 'Bauteildaten(Dn,fw, TabNr, ZNr)
'    frmDIN4109_33_Waende.Hide
'End Sub
'
'
'
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''   Daten aus Dialogbox in Tabellenblatt übertragen                   '''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'
'
'
'Private Function Bauteildaten(Rw As Double, TabNr As Integer, ZNr As Integer) As Boolean
'
'
'    Dim Bild As String
'    Dim Konstruktion As String
'
'    Bild = "imT" & TabNr & "Z" & ZNr
'    Konstruktion = "imKonT" & TabNr & "Z" & ZNr
'
''    If TabNr = 2 And ZNr <= 5 Then
''        Bild = Bild & "1_5"
''        ElseIf TabNr = 2 And ZNr > 5 And ZNr <= 11 Then
''            Bild = Bild & "6_11"
''        ElseIf TabNr = 2 And ZNr > 11 Then
''            Bild = Bild & "12-1_13"
''
''    End If
'
'
'    frmVBAcousticTrennwand.txtRw_Holz = Rw
'
'    Application.ActiveSheet.imgBauteilskizze_Wand.Picture = CallByName(frmDIN4109_33_Waende, Bild, VbGet).Picture
'    Application.ActiveSheet.imgKonstruktion_Wand_gross.Picture = CallByName(frmDIN4109_33_Waende, Konstruktion, VbGet).Picture
'    Application.ActiveSheet.imgKonstruktion_Wand_gross.Visible = True
'
'    Application.ActiveSheet.[Quelle_Trennbauteil] = "Quelle: DIN 4109-33:2016-07, Tabelle " & TabNr & ", Zeile " & ZNr
'
'    clsWand(1).Quelle_Tbt = "Quelle: DIN 4109-33:2016-07, Tabelle " & TabNr & ", Zeile " & ZNr
'    frmDIN4109_33_Waende.Hide
'
''imgTabellenkopf aktivieren
'
'     Application.ActiveSheet.imgTabellenkopf.Picture = frmDIN4109_33_Waende.imgTabellenkopf.Picture
'     Application.ActiveSheet.imgTabellenkopf.Visible = True
'
''imgKonstruktion_Wand ausblenden
'     Application.ActiveSheet.imgKonstruktion_Wand.Visible = False
'
'End Function

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''   Daten aus Dialogbox in Tabellenblatt übertragen                   '''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Function BauteildatenWand(Name As String, Rw As Double, C50 As String, Ctr50 As String, TabNr As Integer, ZNr As Integer, Elementmasse As String, Rsw As String, DRw_SR As String, DRw_ER As String) As Boolean

    Dim Bild As String
    Dim Konstruktion As String
    Dim KonstruktionsbeschreibunginVBAcoustic As String
    Dim BauteildateninVBAcoustic As String
    
    'Bild- und Konstruktionsbeschreibung mit Tabellen- und Zeilennummer
    Bild = "img_Tab" & TabNr & "_Z" & ZNr
    Konstruktion = "img_Kon_Tab" & TabNr & "_Z" & ZNr
    
    'Aufruf von Bauteildaten_Waende(Name, Rw, C50, Ctr50, TabNr, ZNr, Elementmasse, DRw_SR, DRw_ER)in VBAcoustic
    BauteildateninVBAcoustic = VBAcoustic & "!global_Function_Variables.BauteildatenWand"
    Application.Run BauteildateninVBAcoustic, Rw, C50, Ctr50, TabNr, ZNr, Elementmasse, Rsw, DRw_SR, DRw_ER, "DIN4109_33_Wände"
    
    'Konstruktionsbeschreibung und Skizze des Wandaufbaus generieren
    KonstruktionsbeschreibunginVBAcoustic = VBAcoustic & "!global_Function_Variables.Konstruktionsbeschreibung"
    Application.Run KonstruktionsbeschreibunginVBAcoustic, Name
     
End Function

