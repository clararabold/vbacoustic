Option Explicit

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''' Validierungsdaten:
'''''''''''''''' Buttons zur Validierung anzeigen                     ''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Public Sub Validierungsbuttons()

    Dim intLeftPOS As Integer   'Position der linken Kante des Buttons
    Dim intSpace As Integer     'Zwischenraum zwischen den Buttons
    
    Application.Workbooks(VBAcoustic).Activate
    
    If frmVBAcoustic.optHolzbau = True And frmVBAcoustic.optDecke = True Then
        
        With frmVBAcousticTrenndecke
        
            'Rahmen initialisieren
            .frmValidierung.Top = frmVBAcousticTrenndecke.Height - _
            IIf(Application.Width < 1032, 38, 30) - .frmValidierung.Height      'Oberkannte des Rahmens
            
            .frmValidierung.Left = .frmTrenndeckeHolzbau.Width                   'Position vom linken Bildschirmrand festlegen
            
            .frmValidierung.Width = intAppWidth - .frmTrenndeckeHolzbau.Width _
            - .frmProgrammsteuerung.Width - 30                                     'Breite des Rahmens
            
            .frmValidierung.Visible = True                                        'Rahmen anzeigen
            
            'Zwischenraum zwischen den Button berechnen
            intSpace = (.frmValidierung.Width - .cmdValidierungsdaten.Width - .cmdpdf.Width) / 3
            
            'Buttons positionieren
            intLeftPOS = intLeftPOS + intSpace
            .cmdValidierungsdaten.Left = intLeftPOS
            
            
            intLeftPOS = intLeftPOS + .cmdValidierung.Width + intSpace
            .cmdpdf.Left = intLeftPOS
            
            'Validierungsleiste ausblenden falls der Debugmodus nicht aktiviert ist
            If bDebug = False Then .frmValidierung.Visible = False
    
        End With
    
    ElseIf frmVBAcoustic.optHolzbau = True And frmVBAcoustic.optWand = True Then
    
        With frmVBAcousticTrennwand
        
            'Rahmen initialisieren
            .frmValidierung.Top = frmVBAcousticTrennwand.Height - _
            IIf(Application.Width < 1032, 38, 30) - .frmValidierung.Height      'Oberkannte des Rahmens
            
            .frmValidierung.Left = .frmTrennwandHolzbau.Width                   'Position vom linken Bildschirmrand festlegen
            
            .frmValidierung.Width = intAppWidth - .frmTrennwandHolzbau.Width _
            - .frmProgrammsteuerung.Width - 30                                     'Breite des Rahmens
            
            .frmValidierung.Visible = True                                        'Rahmen anzeigen
            
            'Zwischenraum zwischen den Button berechnen
            intSpace = (.frmValidierung.Width - .cmdValidierungsdaten.Width - .cmdValidierung.Width - .cmdpdf_TW.Width) / 4
            
            'Buttons positionieren
            intLeftPOS = intLeftPOS + intSpace
            .cmdValidierungsdaten.Left = intLeftPOS
            
            intLeftPOS = intLeftPOS + .cmdValidierungsdaten.Width + intSpace
            .cmdValidierung.Left = intLeftPOS
            
            intLeftPOS = intLeftPOS + .cmdValidierung.Width + intSpace
            .cmdpdf_TW.Left = intLeftPOS
            
            'Validierungsleiste ausblenden falls der Debugmodus nicht aktiviert ist
            If bDebug = False Then .frmValidierung.Visible = False
    
        End With
    End If
    
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''' Validierungsdaten:
'''''''''''''''' Neuen TRENNDECKEN-Datensatz anlegen                  ''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Public Sub NeuerDatensatz_Trenndecke(intRow As Integer)
    
    'Deklarationen
    Dim strPfad As String
    Dim bFileopen As Boolean
    Dim intcol As Integer
    Dim inti As Integer
    Dim mK1 As Double
    Dim mK2 As Double
    
    'Dialogbox öffnen um Daten der Baumessung abzufragen oder vorhandene Baudaten verwenden?
    If intRow = 0 Then
        If bDebug = True Then frmBaumessung.cmdVerifizierung.Visible = True 'Im Debugmodus Daten als Verifizierungsdatensatz ablegbar
        frmBaumessung.Show                                                  'Dialogbox öffnen
        If frmBaumessung.Tag = "Cancel" Then                                'Dialogbox abbrechen -> Einlesevorgang abbrechen
            frmVBAcousticTrenndecke.frmValidierung.Visible = False          'Falls die Eingabe abgebrochen wird Rahmen "frmValidierung" ausblenden
            Exit Sub                                                        'und Prozedur verlassen
        End If
    Else                                                                    'Baudaten bereits vorhanden
        frmBaumessung.cmdVerifizierung = False                              'Validierungsdaten sollen in vorgegebene Zeile eingetragen werden
    End If

    'Validierungsdatei öffnen
    bFileopen = openfile("Validierung.xlsm")
    If bFileopen = False Then
        MsgBox "Validierungsdatei existiert nicht"                      'Fehlermeldung falls Datei nicht existiert
        Exit Sub                                                        'Abbruch der Prozedur
    End If
    If frmBaumessung.cmdVerifizierung = True Then
        Workbooks("Validierung.xlsm").Worksheets("Verifizierung_Trenndecke").Activate
    Else
        Workbooks("Validierung.xlsm").Worksheets("Validierung_Trenndecke").Activate
    End If
    
    'Daten in Excel-Tabellenblatt schreiben
    With Workbooks("Validierung.xlsm").ActiveSheet
        'Start in der ersten Spalte
        intcol = 1
        
        'Datensatz in die nächste Leere Zeile schreiben oder bestimmte Zeile überschreiben?
        If intRow = 0 Then
            'Leere Zeile finden
            intRow = 4
            Do While .Cells(intRow, 1) <> ""
                intRow = intRow + 1
            Loop
        End If
        
        'Daten der Baumessung eintragen
        .Cells(intRow, intcol) = intRow - 4: intcol = intcol + 1                                           'Zeilennummer
        .Cells(intRow, intcol) = frmBaumessung.txtBVMessung: intcol = intcol + 1                           'BV-Messnummer
        .Cells(intRow, intcol) = frmBaumessung.txtTrennbauteil: intcol = intcol + 1                       'Decke Kurztitel
        If IsNumeric(frmBaumessung.txtLstrichnw) Then
            .Cells(intRow, intcol) = CDbl(frmBaumessung.txtLstrichnw): intcol = intcol + 1                 'L'nw Bau
        Else
            intcol = intcol + 1
        End If
        If IsNumeric(frmBaumessung.txtRstrichw) Then
            .Cells(intRow, intcol) = CDbl(frmBaumessung.txtRstrichw): intcol = intcol + 1                  'R'w Bau
        Else
            intcol = intcol + 1
        End If
        
        'Daten der Decke eintragen
        .Cells(intRow, intcol) = clsDecke(1).Deckentyp: intcol = intcol + 1                                'Deckentyp
        .Cells(intRow, intcol) = clsDecke(1).Estrichtyp: intcol = intcol + 1                               'Estrichtyp
        .Cells(intRow, intcol) = clsDecke(1).Lnw: intcol = intcol + 1                                      'Lnw Decke Labor
        .Cells(intRow, intcol) = clsDecke(1).Rw: intcol = intcol + 1                                       'Rw Decke Labor
        .Cells(intRow, intcol) = clsDecke(1).Quelle: intcol = intcol + 1                                   'Datenquelle
        
        If clsDecke(1).Deckentyp = MHD Or _
           clsDecke(1).Deckentyp = MHD_UD Or _
           clsDecke(1).Deckentyp = MHD_HBV Or _
           clsDecke(1).Deckentyp = MHD_RIPPEN_KASTEN Then
            .Cells(intRow, intcol) = clsDecke(1).Rsw: intcol = intcol + 1                                  'Rw Rohdecke+Beschwerung
            .Cells(intRow, intcol) = clsDecke(1).DLUnterdecke: intcol = intcol + 1                         'Trittschallminderung der Unterdecke
            .Cells(intRow, intcol) = "": intcol = intcol + 1                                               'Deckenbreite 'wird nicht mehr benötigt!!!!
            .Cells(intRow, intcol) = clsDecke(1).mElement: intcol = intcol + 1                             'm' Massivholzdecke+Beschwerung
            .Cells(intRow, intcol) = clsDecke(1).DRUnterdecke: intcol = intcol + 1                         'DRw Unterdecke
            .Cells(intRow, intcol) = clsDecke(1).DREstrich: intcol = intcol + 1                            'DRw Estrich
        Else
            intcol = intcol + 1                                                                            'Rw Rohdecke+Beschwerung
            .Cells(intRow, intcol) = "": intcol = intcol + 1                                               'Deckenlänge 'wird nicht mehr benötigt!!!!!
            .Cells(intRow, intcol) = "": intcol = intcol + 4                                               'Deckenbreite 'wird nicht mehr benötigt!!!!
        End If
        
        .Cells(intRow, intcol) = clsDecke(1).Flaeche: intcol = intcol + 1                                  'Trennfläche S
    
        'Daten der Flanken eintagen
        For inti = 1 To 4
        
            If clsFlanke(inti).FlankentypSR = MHW Then                                        'Massivholzwände "MHW"
                .Cells(intRow, intcol) = clsFlanke(inti).FlankentypSR: intcol = intcol + 2                 'Wandtyp
                .Cells(intRow, intcol) = clsFlanke(inti).WandmasseSR: intcol = intcol + 1                  'm'Element+Bepl
                .Cells(intRow, intcol) = clsFlanke(inti).lfSR: intcol = intcol + 1                         'Länge lf
                .Cells(intRow, intcol) = clsFlanke(inti).RwSR: intcol = intcol + 1                         'Rw, Senderaum
                .Cells(intRow, intcol) = clsFlanke(inti).DRwSR: intcol = intcol + 2                        'DRw, Senderaum
                
                .Cells(intRow, intcol) = clsFlanke(inti).Stossstelle: intcol = intcol + 1                  'Stoßtyp
                .Cells(intRow, intcol) = clsFlanke(inti).KFf: intcol = intcol + 1                          'KFf
                .Cells(intRow, intcol) = clsFlanke(inti).KFd: intcol = intcol + 1                          'KFd
                .Cells(intRow, intcol) = clsFlanke(inti).KDf: intcol = intcol + 1                          'KDf
                
                .Cells(intRow, intcol) = clsFlanke(inti).FlankentypER: intcol = intcol + 2                 'Wandtyp
                .Cells(intRow, intcol) = clsFlanke(inti).WandmasseER: intcol = intcol + 1                  'm'Element+Bepl
                .Cells(intRow, intcol) = clsFlanke(inti).lfER: intcol = intcol + 1                         'Länge lf
                .Cells(intRow, intcol) = clsFlanke(inti).RwER: intcol = intcol + 1                         'Rw, Empfangsraum
                .Cells(intRow, intcol) = clsFlanke(inti).DRwER: intcol = intcol + 2                        'DRw, Empfangsraum
            Else
                .Cells(intRow, intcol) = clsFlanke(inti).FlankentypSR: intcol = intcol + 1                 'Wandtyp
                .Cells(intRow, intcol) = clsFlanke(inti).BeplankungSR: intcol = intcol + 2                 'Beplankung
                .Cells(intRow, intcol) = clsFlanke(inti).lfSR: intcol = intcol + 1                         'Länge lf
                .Cells(intRow, intcol) = clsFlanke(inti).RwSR: intcol = intcol + 1                         'Rw, Senderaum
                .Cells(intRow, intcol) = clsFlanke(inti).DRwSR: intcol = intcol + 1                        'DRw, Senderaum
                .Cells(intRow, intcol) = clsFlanke(inti).DnfwSR: intcol = intcol + 5                       'Dnfw, Senderaum
                
                .Cells(intRow, intcol) = clsFlanke(inti).FlankentypER: intcol = intcol + 1                 'Wandtyp
                .Cells(intRow, intcol) = clsFlanke(inti).BeplankungER: intcol = intcol + 2                 'Beplankung
                .Cells(intRow, intcol) = clsFlanke(inti).lfER: intcol = intcol + 1                         'Länge lf
                .Cells(intRow, intcol) = clsFlanke(inti).RwER: intcol = intcol + 1                         'Rw, Empfangsraum
                .Cells(intRow, intcol) = clsFlanke(inti).DRwER: intcol = intcol + 1                        'DRw, Empfangsraum
                .Cells(intRow, intcol) = clsFlanke(inti).DnfwER: intcol = intcol + 1                       'Dnfw, Empfangsraum
            End If
            
            .Cells(intRow, intcol) = clsFlanke(inti).RFfw: intcol = intcol + 1                             'Ergebnis: RFfw
            If clsFlanke(inti).FlankentypSR = MHW Then                                        'Massivholzwände "MHW"
                .Cells(intRow, intcol) = clsFlanke(inti).RDfw: intcol = intcol + 1                         'Ergebnis: RDfw
                .Cells(intRow, intcol) = clsFlanke(inti).RFdw: intcol = intcol + 1                         'Ergebnis: RFdw
            Else
                intcol = intcol + 2
            End If
            .Cells(intRow, intcol) = clsFlanke(inti).LnDfw: intcol = intcol + 1                            'Ergebnis: LnDfw
            .Cells(intRow, intcol) = clsFlanke(inti).LnDFfw: intcol = intcol + 1                           'Ergebnis: LnDFfw
            
            If (clsFlanke(inti).K1 > mK1) Then mK1 = clsFlanke(inti).K1: mK2 = clsFlanke(inti).K2          'maßgebliches K1 und K2 finden
            
        Next inti
        
        'Berechnungsergebnis eintragen
        .Cells(intRow, intcol) = mK1: intcol = intcol + 1
        .Cells(intRow, intcol) = mK2: intcol = intcol + 1
        .Cells(intRow, intcol) = clsDecke(1).Lnw + mK1 + mK2: intcol = intcol + 1
        .Cells(intRow, intcol) = clsDecke(1).Lstrichnw: intcol = intcol + 1
        .Cells(intRow, intcol) = clsDecke(1).RStrichw: intcol = intcol + 1
        
    End With
    
    'Datei speichern und schließen
    Workbooks("Validierung.xlsm").Save
    Workbooks("Validierung.xlsm").Close

End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''' Validierungsdaten:
'''''''''''''''' Neuen TRENNWAND-Datensatz anlegen                  ''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Public Sub NeuerDatensatz_Trennwand(intRow As Integer)
    
    'Deklarationen
    Dim strPfad As String
    Dim bFileopen As Boolean
    Dim intcol As Integer
    Dim inti As Integer
    Dim mK1 As Double
    Dim mK2 As Double
    
    'Dialogbox öffnen um Daten der Baumessung abzufragen oder vorhandene Baudaten verwenden?
    If intRow = 0 Then
        If bDebug = True Then frmBaumessung.cmdVerifizierung.Visible = True 'Im Debugmodus Daten als Verifizierungsdatensatz ablegbar
        Call frmBaumessung.UserForm_Initialize
        frmBaumessung.Show                                                  'Dialogbox öffnen
        If frmBaumessung.Tag = "Cancel" Then                                'Dialogbox abbrechen -> Einlesevorgang abbrechen
            frmVBAcousticTrennwand.frmValidierung.Visible = False          'Falls die Eingabe abgebrochen wird Rahmen "frmValidierung" ausblenden
            Exit Sub                                                        'und Prozedur verlassen
        End If
    Else                                                                    'Baudaten bereits vorhanden
        frmBaumessung.cmdVerifizierung = False                              'Validierungsdaten sollen in vorgegebene Zeile eingetragen werden
    End If

    'Validierungsdatei öffnen
    bFileopen = openfile("Validierung.xlsm")
    If bFileopen = False Then
        MsgBox "Validierungsdatei existiert nicht"                      'Fehlermeldung falls Datei nicht existiert
        Exit Sub                                                        'Abbruch der Prozedur
    End If
    If frmBaumessung.cmdVerifizierung = True Then
        Workbooks("Validierung.xlsm").Worksheets("Verifizierung_Trennwand").Activate
    Else
        Workbooks("Validierung.xlsm").Worksheets("Validierung_Trennwand").Activate
    End If
    
    'Daten in Excel-Tabellenblatt schreiben
    With Workbooks("Validierung.xlsm").ActiveSheet
        'Start in der ersten Spalte
        intcol = 1
        
        'Datensatz in die nächste Leere Zeile schreiben oder bestimmte Zeile überschreiben?
        If intRow = 0 Then
            'Leere Zeile finden
            intRow = 4
            Do While .Cells(intRow, 1) <> ""
                intRow = intRow + 1
            Loop
        End If
        
        'Daten der Baumessung eintragen
        .Cells(intRow, intcol) = intRow - 3: intcol = intcol + 1                                           'Zeilennummer
        If frmBaumessung.cmdVerifizierung = False Then
            .Cells(intRow, intcol) = frmBaumessung.txtBVMessung                                            'BV-Messnummer
        End If: intcol = intcol + 1
        .Cells(intRow, intcol) = frmBaumessung.txtTrennbauteil: intcol = intcol + 1                        'Decke Kurztitel
        If IsNumeric(frmBaumessung.txtRstrichw_Trennwand) Then
            .Cells(intRow, intcol) = CDbl(frmBaumessung.txtRstrichw_Trennwand): intcol = intcol + 1        'R'w Bau
        Else
            intcol = intcol + 1
        End If
        
        'Daten der Trennwand eintragen
        .Cells(intRow, intcol) = clsWand(1).Wandtyp: intcol = intcol + 1                                    'Wandtyp
        .Cells(intRow, intcol) = clsWand(1).Anwendungstyp: intcol = intcol + 1                              'Anwendungstyp
        .Cells(intRow, intcol) = clsWand(1).Raumanordnung: intcol = intcol + 1                              'Raumanordnung
        .Cells(intRow, intcol) = clsWand(1).Raumbreite: intcol = intcol + 1                                 'Raumhöhe
        .Cells(intRow, intcol) = clsWand(1).Raumhoehe: intcol = intcol + 1                                  'Raumbreite
        .Cells(intRow, intcol) = clsWand(1).Rw: intcol = intcol + 1                                         'Rw
        .Cells(intRow, intcol) = clsWand(1).C50: intcol = intcol + 1                                        'C50
        .Cells(intRow, intcol) = clsWand(1).Quelle_Tbt: intcol = intcol + 1                                 'Quellenangabe
        .Cells(intRow, intcol) = clsWand(1).Rsw: intcol = intcol + 1                                        'Rw Grundwand
        .Cells(intRow, intcol) = clsWand(1).WandmasseTbt: intcol = intcol + 1                               'm'
        .Cells(intRow, intcol) = clsWand(1).DRw_SR: intcol = intcol + 1                                     'DRw SR
        .Cells(intRow, intcol) = clsWand(1).DRw_ER: intcol = intcol + 1                                     'DRw ER
        .Cells(intRow, intcol) = clsWand(1).Flaeche: intcol = intcol + 1                                    'Trennfläche

        'Daten der Flanken eintagen
        For inti = 1 To 4

            .Cells(intRow, intcol) = clsFlanke(inti).FlankentypSR: intcol = intcol + 1                 'Wandtyp
            .Cells(intRow, intcol) = clsFlanke(inti).WandmaterialSR: intcol = intcol + 1               'Wandmaterial
            .Cells(intRow, intcol) = clsFlanke(inti).WandmasseSR: intcol = intcol + 1                  'm'Element+Bepl
            .Cells(intRow, intcol) = clsFlanke(inti).FlaecheSR: intcol = intcol + 1                    'Fläche
            .Cells(intRow, intcol) = clsFlanke(inti).lfSR: intcol = intcol + 1                         'Länge lf
            .Cells(intRow, intcol) = clsFlanke(inti).RwSR: intcol = intcol + 1                         'Rw, Senderaum
            .Cells(intRow, intcol) = clsFlanke(inti).DRwSR: intcol = intcol + 1                        'DRw, Senderaum
            .Cells(intRow, intcol) = clsFlanke(inti).DnfwSR: intcol = intcol + 1                       'Dnfw, Senderaum
            .Cells(intRow, intcol) = clsFlanke(inti).Quelle: intcol = intcol + 1                       'Quellenangaben
    
            .Cells(intRow, intcol) = clsFlanke(inti).Stossstelle: intcol = intcol + 1                  'Stoßtyp
            .Cells(intRow, intcol) = clsFlanke(inti).Stossversatz: intcol = intcol + 1                 'Stoßversatz
            .Cells(intRow, intcol) = clsFlanke(inti).lVersatz: intcol = intcol + 1                     'Versatzlänge
            .Cells(intRow, intcol) = clsFlanke(inti).KijNorm: intcol = intcol + 1                      'Normbezug
            .Cells(intRow, intcol) = IIf(clsFlanke(inti).KFf > -1000, clsFlanke(inti).KFf, "")         'KFf
            intcol = intcol + 1
            .Cells(intRow, intcol) = IIf(clsFlanke(inti).KFd > 0, clsFlanke(inti).KFd, "")             'KFd
            intcol = intcol + 1
            .Cells(intRow, intcol) = clsFlanke(inti).KDf                                               'KDf
            intcol = intcol + 1
            .Cells(intRow, intcol) = clsFlanke(inti).FlankentypER: intcol = intcol + 1                 'Wandtyp
            .Cells(intRow, intcol) = clsFlanke(inti).WandmaterialSR: intcol = intcol + 1               'Wandmaterial
            .Cells(intRow, intcol) = clsFlanke(inti).WandmasseER: intcol = intcol + 1                  'm'Element+Bepl
            .Cells(intRow, intcol) = clsFlanke(inti).FlaecheER: intcol = intcol + 1                    'Fläche
            .Cells(intRow, intcol) = clsFlanke(inti).lfER: intcol = intcol + 1                         'Länge lf
            .Cells(intRow, intcol) = clsFlanke(inti).RwER: intcol = intcol + 1                         'Rw, Senderaum
            .Cells(intRow, intcol) = clsFlanke(inti).DRwER: intcol = intcol + 1                        'DRw, Senderaum
            .Cells(intRow, intcol) = clsFlanke(inti).DnfwER: intcol = intcol + 1                       'Dnfw, Senderaum
            .Cells(intRow, intcol) = clsFlanke(inti).Quelle: intcol = intcol + 1                       'Quellenangaben
                

            .Cells(intRow, intcol) = clsFlanke(inti).RFfw: intcol = intcol + 1                         'Ergebnis: RFfw
            .Cells(intRow, intcol) = IIf(clsFlanke(inti).RFdw > 0, clsFlanke(inti).RFdw, "")           'Ergebnis: RFdw
            intcol = intcol + 1
            .Cells(intRow, intcol) = IIf(clsFlanke(inti).RDfw > 0, clsFlanke(inti).RDfw, "")           'Ergebnis: RDfw
            intcol = intcol + 1
            
        Next inti

        'Berechnungsergebnis eintragen
        .Cells(intRow, intcol) = clsWand(1).RStrichw
        
    End With
    
    'Datei speichern und schließen
    Workbooks("Validierung.xlsm").Save
    Workbooks("Validierung.xlsm").Close

End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''' Validierungsdaten:
'''''''''''''''' Verifizierung durchführen                            ''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

Public Sub Verifizierungsstart()
        
    'Deklarationen
    Dim intRow As Integer
    Dim intcol As Integer
    Dim intFlanke As Integer
    Dim Abweichungsarray() As Double
    Dim DiffRstrichw As Double
    Dim DiffLstrichnw As Double
    Dim bFileopen As Boolean

    
    'Berechnung nach DIN EN ISO 12354 aktivieren
    bDIN4109 = False
    
    'erste Zeile finden
    intRow = 4
    
    'Datei öffnen
    bFileopen = openfile("Validierung.xlsm")
    If bFileopen = False Then
        MsgBox "Validierungsdatei existiert nicht"                      'Fehlermeldung falls Datei nicht existiert
        Exit Sub                                                        'Abbruch der Prozedur
    End If
    
    If frmVBAcoustic.optHolzbau = True And frmVBAcoustic.optDecke = True Then
        Workbooks("Validierung.xlsm").Worksheets("Verifizierung_Trenndecke").Activate
    ElseIf frmVBAcoustic.optHolzbau = True And frmVBAcoustic.optWand = True Then
        Workbooks("Validierung.xlsm").Worksheets("Verifizierung_Trennwand").Activate
    Else
        MsgBox ("keine Verifizierungsdaten für diesen Trennbauteiltyp vorhanden")
        Exit Sub
    End If
    
    'Schleife über alle Verifizierungsbeispiele
    Do While intRow >= 4
    
        'Daten einlesen
        If frmVBAcoustic.optHolzbau = True And frmVBAcoustic.optDecke = True Then
            If Datensatz_einlesen_Trenndecke(intRow) = False Then Exit Do
        ElseIf frmVBAcoustic.optHolzbau = True And frmVBAcoustic.optWand = True Then
            If Datensatz_einlesen_Trennwand(intRow) = False Then Exit Do
        End If
        
        'Berechnung durchführen
        If frmVBAcoustic.optHolzbau = True Then
            Call calc_Holzbau_single.Flankenberechnung 'Flankenübertragung berechnen
            Call calc_Holzbau_single.Bauwerte 'Bauwerte berechnen
        End If
        
        'Berechnungsergebnis der TRENNDECKE eintragen
        If frmVBAcoustic.optHolzbau = True And frmVBAcoustic.optDecke = True Then
            intcol = 39
            For intFlanke = 1 To 4
                Workbooks("Validierung.xlsm").ActiveSheet.Cells(intRow, intcol) = clsFlanke(intFlanke).LnDfw: intcol = intcol + 1
                Workbooks("Validierung.xlsm").ActiveSheet.Cells(intRow, intcol) = clsFlanke(intFlanke).LnDFfw: intcol = intcol + 22
            Next intFlanke
            Workbooks("Validierung.xlsm").ActiveSheet.Cells(intRow, 113) = Round(clsDecke(1).Lstrichnw, 2)
            Workbooks("Validierung.xlsm").ActiveSheet.Cells(intRow, 114) = Round(clsDecke(1).RStrichw, 2)
            
            'Verifizierungsergebnis eintragen
            DiffRstrichw = Round(clsDecke(1).RStrichw - frmBaumessung.txtRstrichw, 2)
            DiffLstrichnw = Round(clsDecke(1).Lstrichnw - frmBaumessung.txtLstrichnw, 2)
            Workbooks("Validierung.xlsm").ActiveSheet.Cells(intRow, 2) = DiffRstrichw & " dB / " & DiffLstrichnw & " dB"
            
            'Zellhintergrund einfärben
            If (Abs(DiffRstrichw) > 0.1 Or Abs(DiffLstrichnw) > 0.1) Then
                Workbooks("Validierung.xlsm").ActiveSheet.Range(Cells(intRow, 2), Cells(intRow, 2)).Interior.Color = vbRed
            Else
                Workbooks("Validierung.xlsm").ActiveSheet.Range(Cells(intRow, 2), Cells(intRow, 2)).Interior.Color = vbGreen
            End If
            
        'Berechnungsergebnis der TRENNWAND eintragen
        ElseIf frmVBAcoustic.optHolzbau = True And frmVBAcoustic.optWand = True Then
            intcol = 43
            For intFlanke = 1 To 4
                Workbooks("Validierung.xlsm").ActiveSheet.Cells(intRow, intcol) = clsFlanke(intFlanke).RFfw: intcol = intcol + 1
                Workbooks("Validierung.xlsm").ActiveSheet.Cells(intRow, intcol) = clsFlanke(intFlanke).RFdw: intcol = intcol + 1
                Workbooks("Validierung.xlsm").ActiveSheet.Cells(intRow, intcol) = clsFlanke(intFlanke).RDfw: intcol = intcol + 26
            Next intFlanke
            Workbooks("Validierung.xlsm").ActiveSheet.Cells(intRow, 130) = Round(clsWand(1).RStrichw, 2)
            
            'Verifizierungsergebnis eintragen
            DiffRstrichw = Round(clsWand(1).RStrichw - frmBaumessung.txtRstrichw, 2)
            Workbooks("Validierung.xlsm").ActiveSheet.Cells(intRow, 2) = DiffRstrichw & " dB"
            
            'Zellhintergrund einfärben
            If (Abs(DiffRstrichw) > 0.1) Then
                Workbooks("Validierung.xlsm").ActiveSheet.Range(Cells(intRow, 2), Cells(intRow, 2)).Interior.Color = vbRed
            Else
                Workbooks("Validierung.xlsm").ActiveSheet.Range(Cells(intRow, 2), Cells(intRow, 2)).Interior.Color = vbGreen
            End If
        End If

        intRow = intRow + 1
        
    Loop
    
End Sub

      
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''' Validierungsdaten:
'''''''''''''''' Validierung durchführen                            ''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

Public Sub Validierungsstart()
        
    'Deklarationen
    Dim intRow As Integer
    Dim Abweichungsarray() As Double
    Dim DiffRstrichw As Double
    Dim DiffLstrichnw As Double
    Dim bFileopen As Boolean

    
    'Berechnung nach DIN EN ISO 12354 aktivieren
    bDIN4109 = False
    
    'erste Zeile finden
    intRow = 4
    
    'Schleife über alle Validierungsbeispiele
    Do While intRow >= 4
    
        'Datei öffnen
        bFileopen = openfile("Validierung.xlsm")
        If bFileopen = False Then
            MsgBox "Validierungsdatei existiert nicht"                      'Fehlermeldung falls Datei nicht existiert
            Exit Sub                                                        'Abbruch der Prozedur
        End If
        
        If frmVBAcoustic.optHolzbau = True And frmVBAcoustic.optDecke = True Then
        
            Workbooks("Validierung.xlsm").Worksheets("Validierung_Trenndecke").Activate
            If Datensatz_einlesen_Trenndecke(intRow) = False Then Exit Do   'Daten einlesen
            Call calc_Holzbau_single.Flankenberechnung 'Flankenübertragung berechnen
            Call calc_Holzbau_single.Bauwerte 'Bauwerte berechnen
            Call NeuerDatensatz_Trenndecke(intRow) 'Validierungsdaten neu eintragen
            
        ElseIf frmVBAcoustic.optHolzbau = True And frmVBAcoustic.optWand = True Then
        
            Workbooks("Validierung.xlsm").Worksheets("Validierung_Trennwand").Activate
            If Datensatz_einlesen_Trennwand(intRow) = False Then Exit Do 'Daten einlesen
            Call calc_Holzbau_single.Flankenberechnung 'Flankenübertragung berechnen
            Call calc_Holzbau_single.Bauwerte 'Bauwerte berechnen
            Call NeuerDatensatz_Trennwand(intRow) 'Validierungsdaten neu eintragen
            
        End If
                
        'Nächste Zeile
        intRow = intRow + 1

    Loop
    
   
End Sub


Function Datensatz_einlesen_Trenndecke(intRow As Integer) As Boolean
    'Deklarationen
    Dim inti As Integer
    Dim X As Integer
    
    With Workbooks("Validierung.xlsm").ActiveSheet
    
        'Falls kein Datensatz mehr vorhanden
        If .Cells(intRow, 1) = "" Then
            Datensatz_einlesen_Trenndecke = False
            Exit Function
        End If
        
        'Objekte anlegen
        ReDim Preserve clsDecke(1 To 1)                                 'Objekt Decke der Klasse Trennbauteil anlegen
        If Not clsDecke(1) Is Nothing Then Set clsDecke(1) = Nothing
        Set clsDecke(1) = New clsTrenndecke
        
        ReDim Preserve clsFlanke(1 To 4)                                'Objekt Flanke der Klasse Flankenbauteil anlegen
        For inti = 1 To 4
            If Not clsFlanke(inti) Is Nothing Then Set clsFlanke(inti) = Nothing
            Set clsFlanke(inti) = New clsFlankenbauteil
        Next inti

        
        'Daten der Baumessung einlesen
        frmBaumessung.txtBVMessung = .Cells(intRow, 2)                  'BV-Messnummer
        frmBaumessung.txtTrennbauteil = .Cells(intRow, 3)              'Decke Kurztitel
        frmBaumessung.txtLstrichnw = .Cells(intRow, 4)                  'L'nw Bau
        frmBaumessung.txtRstrichw = .Cells(intRow, 5)                   'R'w Bau
        
        'Daten der Decke eintragen
        clsDecke(1).Deckentyp = .Cells(intRow, 6)                       'Deckentyp
        clsDecke(1).Estrichtyp = .Cells(intRow, 7)                      'Estrichtyp
        clsDecke(1).Lnw = .Cells(intRow, 8)                             'Lnw Decke Labor
        clsDecke(1).Rw = .Cells(intRow, 9)                              'Rw Decke Labor
        clsDecke(1).Quelle = .Cells(intRow, 10)                         'Datenquelle
        clsDecke(1).Rsw = .Cells(intRow, 11)                            'Rw Rohdecke+Beschwerung
        clsDecke(1).DLUnterdecke = .Cells(intRow, 12)                   'Trittschallminderung der Unterdecke
        'clsDecke(1).L2 = .Cells(intRow, 13)                            'Deckenbreite
        clsDecke(1).mElement = .Cells(intRow, 14)                       'm' Massivholzdecke+Beschwerung
        clsDecke(1).DRUnterdecke = .Cells(intRow, 15)                   'DRw Unterdecke
        clsDecke(1).DREstrich = .Cells(intRow, 16)                      'DRw Estrich
        clsDecke(1).Flaeche = .Cells(intRow, 17)                        'Trennfläche S
    
        'Daten der Flanken eintragen
        For inti = 1 To 4
        
            X = 23 * (inti - 1)
    
            clsFlanke(inti).FlankentypSR = .Cells(intRow, 18 + X)       'Wandtyp
            clsFlanke(inti).BeplankungSR = .Cells(intRow, 19 + X)       'Beplankung
            clsFlanke(inti).WandmasseSR = .Cells(intRow, 20 + X)        'm'Element+Bepl
            clsFlanke(inti).lfSR = .Cells(intRow, 21 + X)               'Länge lf
            clsFlanke(inti).RwSR = .Cells(intRow, 22 + X)               'Rw, Senderaum
            clsFlanke(inti).DRwSR = .Cells(intRow, 23 + X)              'DRw, Senderaum
            clsFlanke(inti).DnfwSR = .Cells(intRow, 24 + X)             'Dnfw, Senderaum
            
            clsFlanke(inti).Stossstelle = .Cells(intRow, 25 + X)        'Stoßtyp
            clsFlanke(inti).KFf = .Cells(intRow, 26 + X)                'KFf
            clsFlanke(inti).KFd = .Cells(intRow, 27 + X)                'KFd
            clsFlanke(inti).KDf = .Cells(intRow, 28 + X)                'KDf
            
            clsFlanke(inti).FlankentypER = .Cells(intRow, 29 + X)       'Wandtyp
            clsFlanke(inti).BeplankungER = .Cells(intRow, 30 + X)       'Beplankung
            clsFlanke(inti).WandmasseER = .Cells(intRow, 31 + X)        'm'Element+Bepl
            clsFlanke(inti).lfER = .Cells(intRow, 32 + X)               'Länge lf
            clsFlanke(inti).RwER = .Cells(intRow, 33 + X)               'Rw, Empfangsraum
            clsFlanke(inti).DRwER = .Cells(intRow, 34 + X)              'DRw, Empfangsraum
            clsFlanke(inti).DnfwER = .Cells(intRow, 35 + X)             'Dnfw, Empfangsraum
            
        Next inti
        
    End With
    
    Datensatz_einlesen_Trenndecke = True

End Function

Function Datensatz_einlesen_Trennwand(intRow As Integer) As Boolean
    'Deklarationen
    Dim inti As Integer
    Dim X As Integer
    
    With Workbooks("Validierung.xlsm").ActiveSheet
    
        'Falls kein Datensatz mehr vorhanden
        If .Cells(intRow, 1) = "" Then
            Datensatz_einlesen_Trennwand = False
            Exit Function
        End If
        
        'Objekte anlegen
        ReDim Preserve clsDecke(1 To 1)                                 'Objekt Decke der Klasse Trennbauteil anlegen
        If Not clsWand(1) Is Nothing Then Set clsWand(1) = Nothing
        Set clsWand(1) = New clsTrennwand
        
        ReDim Preserve clsFlanke(1 To 4)                                'Objekt Flanke der Klasse Flankenbauteil anlegen
        For inti = 1 To 4
            If Not clsFlanke(inti) Is Nothing Then Set clsFlanke(inti) = Nothing
            Set clsFlanke(inti) = New clsFlankenbauteil
        Next inti

        
        'Daten der Baumessung einlesen
        frmBaumessung.txtBVMessung = .Cells(intRow, 2)                  'BV-Messnummer
        frmBaumessung.txtTrennbauteil = .Cells(intRow, 3)               'Trennwand Kurztitel
        frmBaumessung.txtRstrichw = .Cells(intRow, 4)                   'R'w Bau
        
        'Daten der Trennwand eintragen (Spalte 5 - 17)
        clsWand(1).Wandtyp = .Cells(intRow, 5)                          'Wandtyp
        clsWand(1).Anwendungstyp = .Cells(intRow, 6)                    'Anwendungstyp
        clsWand(1).Raumanordnung = .Cells(intRow, 7)                    'Raumanordnung
        clsWand(1).Raumbreite = .Cells(intRow, 8)                       'Raumhöhe
        clsWand(1).Raumhoehe = .Cells(intRow, 9)                        'Raumbreite
        clsWand(1).Rw = .Cells(intRow, 10)                              'Rw
        clsWand(1).C50 = .Cells(intRow, 11)                             'C50
        clsWand(1).Quelle_Tbt = .Cells(intRow, 12)                      'Quellenangabe
        clsWand(1).Rsw = .Cells(intRow, 13)                             'Rw Grundwand
        clsWand(1).WandmasseTbt = .Cells(intRow, 14)                    'm'
        clsWand(1).DRw_SR = .Cells(intRow, 15)                          'DRw SR
        clsWand(1).DRw_ER = .Cells(intRow, 16)                          'DRw ER
        clsWand(1).Flaeche = .Cells(intRow, 17)                         'Trennfläche
        
    
        'Daten der Flanken eintragen (Spalte 18 - 42)
        For inti = 1 To 4
        
            X = 28 * (inti - 1)
    
            clsFlanke(inti).FlankentypSR = .Cells(intRow, 18 + X)                'Wandtyp
            clsFlanke(inti).WandmaterialSR = .Cells(intRow, 19 + X)              'Wandmaterial
            clsFlanke(inti).WandmasseSR = .Cells(intRow, 20 + X)                 'm'Element+Bepl
            clsFlanke(inti).FlaecheSR = .Cells(intRow, 21 + X)                   'Fläche
            clsFlanke(inti).lfSR = .Cells(intRow, 22 + X)                        'Länge lf
            clsFlanke(inti).RwSR = .Cells(intRow, 23 + X)                        'Rw, Senderaum
            clsFlanke(inti).DRwSR = .Cells(intRow, 24 + X)                       'DRw, Senderaum
            clsFlanke(inti).DnfwSR = .Cells(intRow, 25 + X)                      'Dnfw, Senderaum
            clsFlanke(inti).Quelle = .Cells(intRow, 26 + X)                      'Quellenangaben
    
            clsFlanke(inti).Stossstelle = .Cells(intRow, 27 + X)                 'Stoßtyp
            clsFlanke(inti).Stossversatz = .Cells(intRow, 28 + X)                'Stoßversatz
            clsFlanke(inti).lVersatz = .Cells(intRow, 29 + X)                    'Versatzlänge
            clsFlanke(inti).KijNorm = .Cells(intRow, 30 + X)                     'Normbezug
            clsFlanke(inti).KFf = .Cells(intRow, 31 + X)                         'KFf
            clsFlanke(inti).KFd = .Cells(intRow, 32 + X)                         'KFd
            clsFlanke(inti).KDf = .Cells(intRow, 33 + X)                         'KDf
            
            clsFlanke(inti).FlankentypER = .Cells(intRow, 34 + X)                'Wandtyp
            clsFlanke(inti).WandmaterialSR = .Cells(intRow, 35 + X)              'Wandmaterial
            clsFlanke(inti).WandmasseER = .Cells(intRow, 36 + X)                 'm'Element+Bepl
            clsFlanke(inti).FlaecheER = .Cells(intRow, 37 + X)                   'Fläche
            clsFlanke(inti).lfER = .Cells(intRow, 38 + X)                        'Länge lf
            clsFlanke(inti).RwER = .Cells(intRow, 39 + X)                        'Rw, Senderaum
            clsFlanke(inti).DRwER = .Cells(intRow, 40 + X)                       'DRw, Senderaum
            clsFlanke(inti).DnfwER = .Cells(intRow, 41 + X)                      'Dnfw, Senderaum
            clsFlanke(inti).Quelle = .Cells(intRow, 42 + X)                      'Quellenangaben
                
        Next inti
        
    End With
    
    Datensatz_einlesen_Trennwand = True

End Function

