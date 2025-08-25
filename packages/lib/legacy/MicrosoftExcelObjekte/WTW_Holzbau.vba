Option Explicit

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''            Tabellenblatt initialisieren                             '''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Public Sub Initialize()

        Dim inti As Integer
        
        Worksheets("WTW_Holzbau").Activate
               
        'Zeilen der Vorsatzschalen im Tabellenblatt zunächst ausblenden
        Rows("34:36").EntireRow.Hidden = True: Rows("65:67").EntireRow.Hidden = False
        Rows("43:45").EntireRow.Hidden = True: Rows("68:70").EntireRow.Hidden = False
        Rows("52:54").EntireRow.Hidden = True: Rows("71:73").EntireRow.Hidden = False
        Rows("61:63").EntireRow.Hidden = True: Rows("74:76").EntireRow.Hidden = False
       
        'Verbesserung durch Vorsatzschalen an der Trennwand ausblenden
        Cells(23, 9) = ""
        Cells(24, 9) = ""
        Cells(25, 9) = ""
        
        'Quellenangaben zurücksetzen
        For inti = 1 To 4
            Range("Quelle_Flanke_" & inti) = clsFlanke(inti).Quelle
        Next inti
        
        'Darstellung des Ergebnisprotokolls für diagonale Raumanordnung steuern
        If clsWand(1).Raumanordnung = DIAGONAL Then
            Rows("47:76").EntireRow.Hidden = True                               'Bereich für Flanke 3 und 4 ausblenden
            Rows("77:81").EntireRow.Hidden = False                             'Bereich für die Diagonale Übertragung einblenden
            Rows("65:70").EntireRow.Hidden = True                               'Bereich für Flanke 3 und 4 ausblenden
            ActiveSheet.imgWTWDiagonal.Visible = True                           'Bild für die diagonale Raumanordnung einblenden
            ActiveSheet.imgWTWDiagonal.Picture = LoadPicture("")
            ActiveSheet.imgWTWDiagonal.Picture = _
            frmVBAcousticTrennwand.Controls("imgDiagonal_FL1MHdurch_FL2MHgetr").Picture
            ActiveSheet.imgDnFfwDIN4109_2.Visible = True
        Else                                                                    'Standardfall wieder herstellen
            Rows("77:81").EntireRow.Hidden = True
            Rows("47:76").EntireRow.Hidden = False
            ActiveSheet.imgWTWDiagonal.Visible = False
            Rows("65:70").EntireRow.Hidden = False
            ActiveSheet.imgDnFfwDIN4109_2.Visible = False
        End If
        
End Sub



''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''    Berechnungsergebnisse in das Excel-Tabellenblatt übertragen und als pdf anzeigen        ''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Sub Ergebnisprotokoll()
        
    'lokale Variablen deklarieren
    Dim inti As Integer
    Dim Ausgabe As String
    Dim nFlanken As Integer
    Dim strtemp As String
      
    'Ergebnisprotokoll zurücksetzen
    Call Worksheets("WTW_Holzbau").Initialize
        
    'Verkürzter Zugriff auf Dialogdaten in frmVBAcoustic
    With frmVBAcoustic
    
        'Tabellenblatt "WTW_Holzbau" aktivieren
        Worksheets("WTW_Holzbau").Activate

        'Daten für Trennwand in das Tabellenblatt übertragen
        ActiveSheet.[RwWand] = clsWand(1).Rw
        ActiveSheet.[Wandtyp] = clsWand(1).Wandtyp
        If clsWand(1).Raumanordnung = DIAGONAL Then
            ActiveSheet.[Wandflaeche] = "keine gemeinsame Trennfläche (Räume diagonal versetzt)"
        Else
            ActiveSheet.[Wandflaeche] = clsWand(1).Flaeche
        End If
        If clsWand(1).WandmasseTbt > 0 Then
            ActiveSheet.[GrundwandMasse] = clsWand(1).WandmasseTbt
        Else
            ActiveSheet.[GrundwandMasse] = "-"
        End If
        
        'Ggf. vorhandene Vorsatzschalen angeben
        If clsWand(1).DRw_SR > 0 Or clsWand(1).DRw_ER > 0 Then
            ActiveSheet.[T_DRVorsatzschalen] = "Verbesserung durch Vorsatzschalen:"
            
            If clsWand(1).DRw_SR > 0 Then
                ActiveSheet.[B_Senderaum] = "Senderaum:"
                ActiveSheet.[B_DR_TW_Senderaum] = "DRw ="
                ActiveSheet.[B_DR_TW_Senderaum].Characters(3, 1).Font.Subscript = True
                ActiveSheet.[B_DR_TW_Senderaum].Characters(1, 1).Font.Name = "Symbol"
                ActiveSheet.[B_DR_TW_Senderaum].Characters(2, 2).Font.Name = "Calibri"
                ActiveSheet.[DR_TW_Senderaum] = clsWand(1).DRw_SR
            Else
                ActiveSheet.[B_Senderaum] = ""
                ActiveSheet.[B_DR_TW_Senderaum] = ""
                ActiveSheet.[DR_TW_Senderaum] = ""
            End If
            
            If clsWand(1).DRw_ER > 0 Then
                ActiveSheet.[B_Empfangsraum] = "Empfangsraum:"
                ActiveSheet.[B_DR_TW_Empfangsraum] = "DRw ="
                ActiveSheet.[B_DR_TW_Empfangsraum].Characters(3, 1).Font.Subscript = True
                ActiveSheet.[B_DR_TW_Empfangsraum].Characters(1, 1).Font.Name = "Symbol"
                ActiveSheet.[B_DR_TW_Empfangsraum].Characters(2, 2).Font.Name = "Calibri"
                ActiveSheet.[DR_TW_Empfangsraum] = clsWand(1).DRw_ER
            Else
                ActiveSheet.[B_Empfangsraum] = ""
                ActiveSheet.[B_DR_TW_Empfangsraum] = ""
                ActiveSheet.[DR_TW_Empfangsraum] = ""
            End If

         Else
            ActiveSheet.[T_DRVorsatzschalen] = ""
            ActiveSheet.[B_Senderaum] = ""
            ActiveSheet.[B_Empfangsraum] = ""
            ActiveSheet.[B_DR_TW_Senderaum] = ""
            ActiveSheet.[DR_TW_Senderaum] = ""
            ActiveSheet.[B_DR_TW_Empfangsraum] = ""
            ActiveSheet.[DR_TW_Empfangsraum] = ""
         End If

     'Anzahl der darzustellenden Flanken abfragen
     nFlanken = IIf(clsWand(1).Raumanordnung = DIAGONAL, 2, 4)
     
     'Daten der Flanken übertragen
     If bDIN4109 = True Then
         ActiveSheet.[Berechnungsweise] = "Berechnung nach DIN4109:"         'Berechnungsart eintragen
         
    
     Else
         ActiveSheet.[Berechnungsweise] = "Prognoseergebnis:"                'Berechnungsart eintragen
         For inti = 1 To nFlanken
             Range("B_RFfw_" & inti) = "RFf,w ="
             Range("B_RFfw_" & inti).Characters(2, 4).Font.Subscript = True
             Range("B_KFf_" & inti) = " ": Range("KFf_" & inti) = " "        'Feldinhalte zurücksetzen
             Range("B_KFd_" & inti) = " ": Range("KFd_" & inti) = " "        'Feldinhalte zurücksetzen
             Range("B_KDf_" & inti) = " ": Range("KDf_" & inti) = " "        'Feldinhalte zurücksetzen
             Range("B_RFdw_" & inti) = " ": Range("RFdw_" & inti) = " "      'Feldinhalte zurücksetzen
             Range("B_RDfw_" & inti) = " ": Range("RDfw_" & inti) = " "      'Feldinhalte zurücksetzen
             Range("Flankentyp" & inti) = clsFlanke(inti).FlankentypSR       'Flankentyp eintragen
             Range("lf_Flanke_" & inti) = clsFlanke(inti).lfSR               'Kantenlänge eintragen
             Range("Quelle_Flanke_" & inti) = clsFlanke(inti).Quelle         'Quelle eintragen

             If clsFlanke(inti).FlankentypSR = HSTW Or _
                clsFlanke(inti).FlankentypSR = MSTW Or _
                clsFlanke(inti).FlankentypSR = HBD Or _
                clsFlanke(inti).FlankentypSR = HB_FLACHD Or _
                clsFlanke(inti).FlankentypSR = SP_STEILD Then 'Leichtbauflanken
                
                If clsFlanke(inti).Stossversatz = "" Then                    'kein Versatz im Wandstoß
                    If clsWand(1).Raumanordnung = DIAGONAL Then
                        Range("Stoßstelle" & inti) = clsFlanke(inti).Stossstelle
                    Else
                        Range("Stoßstelle" & inti) = ""
                    End If
                    Range("Masse" & inti) = ""                                   'flächenbezogene Masse nur bei Massiv(holz)wand
                    Range("B_KFf_" & inti) = "Dn,f,w ="                          'Dnfw eintragen
                    Range("B_KFf_" & inti).Characters(2, 5).Font.Subscript = True
                    Range("KFf_" & inti) = clsFlanke(inti).DnfwSR                'Dnfw eintragenn
                    strtemp = IIf(clsWand(1).Raumanordnung = DIAGONAL, "Dn,Ff" & -1 + 2 * inti & ",w =", "RFf,w   =")
                    Range("B_RFfw_" & inti) = strtemp
                    Range("B_RFfw_" & inti).Characters(2, 7).Font.Subscript = True
                    Range("RFfw_" & inti) = clsFlanke(inti).RFfw                 'Flankendämm-Maß eintragen
                    
                ElseIf clsFlanke(inti).Stossversatz <> "" Then
                    Range("Stoßstelle" & inti) = clsFlanke(inti).Stossversatz    'Beschreibung Stoßversatz Leichtbauwand
                    If clsFlanke(inti).RFdw > 0 Then
                        Range("B_KFf_" & inti) = "KFd ="
                        Range("B_KFf_" & inti).Characters(2, 2).Font.Subscript = True
                        Range("KFf_" & inti) = clsFlanke(inti).KFd
                        Range("B_RFfw_" & inti) = "RFd,w ="
                        Range("B_RFfw_" & inti).Characters(2, 4).Font.Subscript = True
                        Range("RFfw_" & inti) = clsFlanke(inti).RFdw
                    ElseIf clsFlanke(inti).RDfw > 0 Then
                        Range("B_KFf_" & inti) = "KDf ="
                        Range("B_KFf_" & inti).Characters(2, 2).Font.Subscript = True
                        Range("KFf_" & inti) = clsFlanke(inti).KDf
                        Range("B_RFfw_" & inti) = "RDf,w ="
                        Range("B_RFfw_" & inti).Characters(2, 4).Font.Subscript = True
                        Range("RFfw_" & inti) = clsFlanke(inti).RDfw
                    End If
                
                End If
                
             ElseIf clsFlanke(inti).FlankentypSR = MHW Or _
                clsFlanke(inti).FlankentypSR = MHD Or _
                clsFlanke(inti).FlankentypSR = MH_FLACHD Then  'Massivholzflanken"
                
                If clsFlanke(inti).Stossversatz <> "" Then
                    Range("Stoßstelle" & inti) = clsFlanke(inti).Stossversatz    'Beschreibung Stoßversatz Massiv(holz)wand
                Else
                    Range("Stoßstelle" & inti) = clsFlanke(inti).Stossstelle    'Stoßstelle Massiv(holz)wand ohne Versatz
                End If
                
                Range("Masse" & inti) = clsFlanke(inti).WandmasseSR         'flächenbezogene Masse der Massiv(holz)wand
                strtemp = IIf(clsWand(1).Raumanordnung = DIAGONAL, "Dn,Ff" & -1 + 2 * inti & ",w =", "RFf,w   =")
                Range("B_RFfw_" & inti) = strtemp
                Range("B_RFfw_" & inti).Characters(2, 7).Font.Subscript = True
                Range("RFfw_" & inti) = clsFlanke(inti).RFfw                'RFf,w eintragen
                strtemp = IIf(clsWand(1).Raumanordnung = DIAGONAL, "KFf" & -1 + 2 * inti & " =", "KFf =")
                Range("B_KFf_" & inti) = strtemp                            'KFf eintragen
                Range("B_KFf_" & inti).Characters(2, 3).Font.Subscript = True
                Range("KFf_" & inti) = clsFlanke(inti).KFf                  'KFf eintragenn

                If clsWand(1).Wandtyp = MHW Or clsWand(1).Wandtyp = MW Then
                     If clsFlanke(inti).KFd > -1000 Then
                        strtemp = IIf(clsWand(1).Raumanordnung = DIAGONAL, "KFf" & 2 * inti & " =", "KFd =")
                        Range("B_KFd_" & inti) = strtemp
                        Range("B_KFd_" & inti).Characters(2, 3).Font.Subscript = True
                        Range("KFd_" & inti) = clsFlanke(inti).KFd
                        strtemp = IIf(clsWand(1).Raumanordnung = DIAGONAL, "Dn,Ff" & 2 * inti & ",w =", "RFd,w   =")
                        Range("B_RDfw_" & inti) = strtemp
                        Range("B_RDfw_" & inti).Characters(2, 7).Font.Subscript = True
                        Range("RDfw_" & inti) = clsFlanke(inti).RFdw
                     End If
                     If clsFlanke(inti).KDf > -1000 Then
                        Range("B_KDf_" & inti) = "KDf ="
                        Range("B_KDf_" & inti).Characters(2, 2).Font.Subscript = True
                        Range("KDf_" & inti) = clsFlanke(inti).KDf
                        Range("B_RFdw_" & inti) = "RDf,w ="
                        Range("B_RFdw_" & inti).Characters(2, 4).Font.Subscript = True
                        Range("RFdw_" & inti) = clsFlanke(inti).RDfw
                     End If
                End If
                
             Else
                
                Range("Stoßstelle" & inti) = "Durchlaufende Massivflanke"   'Stoßstelle Massiv(holz)wand
                Range("Masse" & inti) = clsFlanke(inti).WandmasseSR         'flächenbezogene Masse der Massiv(holz)wand
                Range("RFfw_" & inti) = clsFlanke(inti).RFfw                'RFf,w eintragen
                Range("B_KFf_" & inti) = "Kij,min ="                        'Kij,min eintragen
                Range("B_KFf_" & inti).Characters(2, 7).Font.Subscript = True
                Range("KFf_" & inti) = clsFlanke(inti).KFf                  'Kij,min eintragenn
    
             End If
         Next inti
     End If

     'Verbesserungen durch Vorsatzschalen eintragen
     For inti = 1 To nFlanken
         If clsFlanke(inti).DRwSR > 0 Or clsFlanke(inti).DRwER > 0 Then
             ActiveSheet.Rows(34 + (inti - 1) * 9).EntireRow.Hidden = False        'Zeilen einblenden
             ActiveSheet.Rows(35 + (inti - 1) * 9).EntireRow.Hidden = False        'Zeilen einblenden
             ActiveSheet.Rows(36 + (inti - 1) * 9).EntireRow.Hidden = False        'Zeilen einblenden
             ActiveSheet.Rows(65 + (inti - 1) * 3).EntireRow.Hidden = True         'Leerzeilen ausblenden
             ActiveSheet.Rows(66 + (inti - 1) * 3).EntireRow.Hidden = True         'Leerzeilen ausblenden
             ActiveSheet.Rows(67 + (inti - 1) * 3).EntireRow.Hidden = True         'Leerzeilen ausblenden
             Range("DRwSR" & inti) = clsFlanke(inti).DRwSR
             Range("DRwER" & inti) = clsFlanke(inti).DRwER
         Else
             ActiveSheet.Rows(34 + (inti - 1) * 9).EntireRow.Hidden = True        'Zeilen einblenden
             ActiveSheet.Rows(35 + (inti - 1) * 9).EntireRow.Hidden = True        'Zeilen einblenden
             ActiveSheet.Rows(36 + (inti - 1) * 9).EntireRow.Hidden = True        'Zeilen einblenden
             ActiveSheet.Rows(65 + (inti - 1) * 3).EntireRow.Hidden = False         'Leerzeilen ausblenden
             ActiveSheet.Rows(66 + (inti - 1) * 3).EntireRow.Hidden = False         'Leerzeilen ausblenden
             ActiveSheet.Rows(67 + (inti - 1) * 3).EntireRow.Hidden = False         'Leerzeilen ausblenden
         End If

     Next inti

    'Berechnungsergebnis für den Bauwert übertragen
    If clsWand(1).Raumanordnung = DIAGONAL Then
        ActiveSheet.[Bezeinung_Einzahlwert] = "Bewertete Norm-Schallpegeldifferenz"
        ActiveSheet.[Formelzeichen_Einzalwert] = "     Dn,w   ="
        Range("Formelzeichen_Einzalwert").Characters(7, 3).Font.Subscript = True
        ActiveSheet.[Rstrichw_Wand] = clsWand(1).RStrichw
    Else
        If clsWand(1).Flaeche >= 10 Then
            ActiveSheet.[Bezeinung_Einzahlwert] = "Bewertetes Bau-Schalldämm-Maß"
            ActiveSheet.[Formelzeichen_Einzalwert] = "     R'w   ="
            Range("Formelzeichen_Einzalwert").Characters(8, 1).Font.Subscript = True
            ActiveSheet.[Rstrichw_Wand] = clsWand(1).RStrichw
        Else
            ActiveSheet.[Bezeinung_Einzahlwert] = "Bewertete Norm-Schallpegeldifferenz"
            ActiveSheet.[Formelzeichen_Einzalwert] = "     Dn,w   ="
            Range("Formelzeichen_Einzalwert").Characters(7, 3).Font.Subscript = True
            ActiveSheet.[Rstrichw_Wand] = clsWand(1).RStrichw - 10 * Log10(clsWand(1).Flaeche / 10)
        End If
    End If
    
    
    'Tabellenblatt neu berechnen
    ActiveSheet.Calculate
    
    'Bilder neu positionieren
    ActiveSheet.imgWTWDiagonal.Top = ActiveSheet.Range("C79").Top - 5
    ActiveSheet.imgDnFfwDIN4109_2.Top = ActiveSheet.Range("G79").Top + 30


    'Berechnungsergebnis als pdf abspeichern und anzeigen
    Call global_Function_Variables.PDF_Print_Sheet
            
    End With
    
End Sub

