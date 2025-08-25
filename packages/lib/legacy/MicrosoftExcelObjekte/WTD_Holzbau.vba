Option Explicit

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''            Tabellenblatt initialisieren                             '''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Public Sub Initialize()

        Worksheets("WTD_Holzbau").Activate
        
        'Zeilen der Vorsatzschalen im Tabellenblatt zunächst ausblenden
        Rows("34:36").EntireRow.Hidden = True: Rows("65:67").EntireRow.Hidden = False
        Rows("43:45").EntireRow.Hidden = True: Rows("68:70").EntireRow.Hidden = False
        Rows("52:54").EntireRow.Hidden = True: Rows("71:73").EntireRow.Hidden = False
        Rows("61:63").EntireRow.Hidden = True: Rows("74:76").EntireRow.Hidden = False
        
        'Verbesserung durch Estrichaufbau und Unterdecke ausblenden
        Cells(23, 9) = ""
        ActiveSheet.[DREstrich] = ""
        Cells(24, 9) = ""
        Cells(25, 9) = ""
        ActiveSheet.[DRUnterdecke] = ""
        
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
        
    'Verkürzter Zugriff auf Dialogdaten in frmVBAcoustic
    With frmVBAcoustic
    
    ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    'Trennbauteil: Holzdecke, Flanke: Holz- oder Leichtbau           '
    ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    If .optDecke = True And .optHolzbau = True Then
        
        'Tabellenblatt "WTD_Holzbau" aktivieren
        Worksheets("WTD_Holzbau").Activate
        
        'Daten für Trenndecke in das Tabellenblatt übertragen
        ActiveSheet.[Deckentyp] = clsDecke(1).Deckentyp
        ActiveSheet.[Estrichtyp] = clsDecke(1).Estrichtyp
        ActiveSheet.[RwDecke] = clsDecke(1).Rw
        ActiveSheet.[LnwDecke] = clsDecke(1).Lnw
        ActiveSheet.[Deckenflaeche] = clsDecke(1).Flaeche
        
        'Spektrumanpassungswert ausgeben - falls vorhanden
        If clsDecke(1).CI50 > -1000 Then
            Ausgabe = "(" & clsDecke(1).CI50
            Ausgabe = Ausgabe & " dB)"
            ActiveSheet.[CI50Decke] = Ausgabe
        Else
            ActiveSheet.[CI50Decke] = "(-)"
        End If
        
        'Deckentypabhängige Daten für Massivholzdecken
        If clsDecke(1).Deckentyp = MHD Or _
           clsDecke(1).Deckentyp = MHD_UD Or _
           clsDecke(1).Deckentyp = MHD_HBV Or _
           clsDecke(1).Deckentyp = MHD_RIPPEN_KASTEN Then
           
            ActiveSheet.[B_mDeckeBeschwerung] = "Rohdecke+Beschwerung: m' ="
            ActiveSheet.[mDeckeBeschwerung] = clsDecke(1).mElement
            
            If clsDecke(1).DRUnterdecke > 0 And bDIN4109 = False Then
                ActiveSheet.[T_DRUnterdecke] = "Verbesserung durch Unterdecke:"
                ActiveSheet.[B_DRUnterdecke] = "DRw ="
                ActiveSheet.[B_DRUnterdecke].Characters(3, 1).Font.Subscript = True
                ActiveSheet.[B_DRUnterdecke].Characters(1, 1).Font.Name = "Symbol"
                ActiveSheet.[B_DRUnterdecke].Characters(2, 2).Font.Name = "Calibri"
                ActiveSheet.[DRUnterdecke] = clsDecke(1).DRUnterdecke
            Else
                ActiveSheet.[T_DRUnterdecke] = ""
                ActiveSheet.[B_DRUnterdecke] = ""
                ActiveSheet.[DRUnterdecke] = ""
            End If
            If clsDecke(1).DREstrich > 0 And bDIN4109 = False Then
                ActiveSheet.[T_DREstrich] = "Verbesserung durch Estrichaufbau:"
                ActiveSheet.[B_DREstrich] = "DRw ="
                ActiveSheet.[B_DREstrich].Characters(3, 1).Font.Subscript = True
                ActiveSheet.[B_DREstrich].Characters(1, 1).Font.Name = "Symbol"
                ActiveSheet.[B_DREstrich].Characters(2, 2).Font.Name = "Calibri"
                ActiveSheet.[DREstrich] = clsDecke(1).DREstrich
            Else
                ActiveSheet.[T_DREstrich] = ""
                ActiveSheet.[B_DREstrich] = ""
                ActiveSheet.[DREstrich] = ""
            End If
            If clsDecke(1).DLUnterdecke > 0 And bDIN4109 = False Then
                ActiveSheet.[B_DLUnterdecke] = "DLw ="
                ActiveSheet.[B_DLUnterdecke].Characters(3, 1).Font.Subscript = True
                ActiveSheet.[B_DLUnterdecke].Characters(1, 1).Font.Name = "Symbol"
                ActiveSheet.[B_DLUnterdecke].Characters(2, 2).Font.Name = "Calibri"
                ActiveSheet.[DLUnterdecke] = clsDecke(1).DLUnterdecke
            Else
                ActiveSheet.[B_DLUnterdecke] = ""
                ActiveSheet.[DLUnterdecke] = ""
            End If

            
        Else
        
            ActiveSheet.[B_mDeckeBeschwerung] = "": ActiveSheet.[mDeckeBeschwerung] = ""
            ActiveSheet.[T_DRUnterdecke] = ""
            ActiveSheet.[B_DRUnterdecke] = "": ActiveSheet.[DRUnterdecke] = ""
            ActiveSheet.[B_DLUnterdecke] = "": ActiveSheet.[DLUnterdecke] = ""
            ActiveSheet.[T_DREstrich] = ""
            ActiveSheet.[B_DREstrich] = "": ActiveSheet.[DREstrich] = ""

        End If
        
        
       
        'Daten der Flanken übertragen
        If bDIN4109 = True Then
            ActiveSheet.[Berechnungsweise] = "Berechnung nach DIN4109:"         'Berechnungsart eintragen
            For inti = 1 To 4
                Range("B_KFf_" & inti) = " ": Range("KFf_" & inti) = " "        'Feldinhalte zurücksetzen
                Range("B_KFd_" & inti) = " ": Range("KFd_" & inti) = " "        'Feldinhalte zurücksetzen
                Range("B_KDf_" & inti) = " ": Range("KDf_" & inti) = " "        'Feldinhalte zurücksetzen
                Range("B_RFdw_" & inti) = " ": Range("RFdw_" & inti) = " "      'Feldinhalte zurücksetzen
                Range("B_RDfw_" & inti) = " ": Range("RDfw_" & inti) = " "      'Feldinhalte zurücksetzen
                Range("Wandtyp" & inti) = clsFlanke(inti).FlankentypSR          'Wandtyp eintragen
                Range("lf_Flanke" & inti) = clsFlanke(inti).lfSR                'Kantenlänge eintragen
                
                If clsFlanke(inti).FlankentypSR = HSTW And _
                   clsFlanke(inti).BeplankungSR <> HWST Then   'Holzständerwand mit Holzwerkstofffplatte
                    Range("StossOderBepl" & inti) = clsFlanke(inti).BeplankungSR 'Beplankung eintragen
                    Range("mWandBepl" & inti) = ""                              'Masse der Wand nicht relevant
                    Range("RFfw_" & inti) = clsFlanke(inti).RFfw                'Flankendämm-Maß eintragen
                Else
                    Range("StossOderBepl" & inti) = _
                    "fl. Wand durch Decke vollständig unterbrochen"             'Platform-framing
                    Range("mWandBepl" & inti) = ""                              'Masse der Wand nicht relevant
                    Range("RFfw_" & inti) = "-"                                 'kann nicht berechnet werden
                End If
                    
                Range("B_LnDFfw_" & inti) = "K2 ="                               'Bezeichner für K1 und K2 eintragen
                Range("B_LnDFfw_" & inti).Characters(2, 1).Font.Subscript = True 'Bezeichner für K1 und K2 eintragen
                Range("B_LnDfw_" & inti) = "K1 ="                                'Bezeichner für K1 und K2 eintragen
                Range("B_LnDfw_" & inti).Characters(2, 1).Font.Subscript = True  'Bezeichner für K1 und K2 eintragen
                
                If clsDecke(1).Deckentyp = MHD_UD Then '"Massivholzdecke mit Unterdecke
                    Range("LnDFfw_" & inti) = "-"                                'nicht berechenbar
                    Range("LnDfw_" & inti) = "-"                                 'nicht berechenbar
                Else
                    Range("LnDFfw_" & inti) = clsFlanke(inti).K2                 'K1 und K2 eintragen
                    Range("LnDfw_" & inti) = clsFlanke(inti).K1                  'K1 und K2 eintragen
                End If
                
            Next inti
        Else
            ActiveSheet.[Berechnungsweise] = "Prognoseergebnis:"                'Berechnungsart eintragen
            For inti = 1 To 4
                Range("B_KFf_" & inti) = " ": Range("KFf_" & inti) = " "        'Feldinhalte zurücksetzen
                Range("B_KFd_" & inti) = " ": Range("KFd_" & inti) = " "        'Feldinhalte zurücksetzen
                Range("B_KDf_" & inti) = " ": Range("KDf_" & inti) = " "        'Feldinhalte zurücksetzen
                Range("B_RFdw_" & inti) = " ": Range("RFdw_" & inti) = " "      'Feldinhalte zurücksetzen
                Range("B_RDfw_" & inti) = " ": Range("RDfw_" & inti) = " "      'Feldinhalte zurücksetzen
                Range("Wandtyp" & inti) = clsFlanke(inti).FlankentypSR          'Wandtyp eintragen
                Range("lf_Flanke" & inti) = clsFlanke(inti).lfSR                'Kantenlänge eintragen
                
                If clsFlanke(inti).FlankentypSR = HSTW Then        'Holzständerwand "HSTW"
                    Range("StossOderBepl" & inti) = clsFlanke(inti).BeplankungSR 'Beplankung eintragen
                    Range("mWandBepl" & inti) = ""                              'Masse der Wand nicht relevant
                    Range("RFfw_" & inti) = clsFlanke(inti).RFfw                'Flankendämm-Maß eintragen
                Else
                    Range("StossOderBepl" & inti) = clsFlanke(inti).Stossstelle 'Stoßstelle Massivholzwand
                    Range("mWandBepl" & inti) = clsFlanke(inti).WandmasseSR     'flächenbezogene Masse der Massivholzwand + Beplankung
                    Range("RFfw_" & inti) = clsFlanke(inti).RFfw                'RFf,w eintragen
                    Range("B_KFf_" & inti) = "KFf ="                            'KFf eintragen
                    Range("B_KFf_" & inti).Characters(2, 2).Font.Subscript = True
                    Range("KFf_" & inti) = clsFlanke(inti).KFf                  'KFf eintragenn
                    
                    If clsDecke(1).Deckentyp = MHD Or _
                       clsDecke(1).Deckentyp = MHD_UD Or _
                       clsDecke(1).Deckentyp = MHD_HBV Or _
                       clsDecke(1).Deckentyp = MHD_RIPPEN_KASTEN Then
                        Range("B_KFd_" & inti) = "KFd ="
                        Range("B_KFd_" & inti).Characters(2, 2).Font.Subscript = True
                        Range("KFd_" & inti) = clsFlanke(inti).KFd
                        Range("B_KDf_" & inti) = "KDf ="
                        Range("B_KDf_" & inti).Characters(2, 2).Font.Subscript = True
                        Range("KDf_" & inti) = clsFlanke(inti).KDf
                        Range("B_RFdw_" & inti) = "RFd,w ="
                        Range("B_RFdw_" & inti).Characters(2, 4).Font.Subscript = True
                        Range("RFdw_" & inti) = clsFlanke(inti).RFdw
                        Range("B_RDfw_" & inti) = "RDf,w ="
                        Range("B_RDfw_" & inti).Characters(2, 4).Font.Subscript = True
                        Range("RDfw_" & inti) = clsFlanke(inti).RDfw
                    End If
                End If
            
                Range("B_LnDFfw_" & inti) = "LnDFf,w ="                          'LnDFfw eintragen
                Range("B_LnDFfw_" & inti).Characters(2, 6).Font.Subscript = True 'LnDFfw eintragen
                Range("LnDFfw_" & inti) = clsFlanke(inti).LnDFfw                'LnDFfw eintragen
                Range("B_LnDfw_" & inti) = "LnDf,w ="                           'LnDfw eintragen
                Range("B_LnDfw_" & inti).Characters(2, 5).Font.Subscript = True 'LnDfw eintragen
                Range("LnDfw_" & inti) = clsFlanke(inti).LnDfw                  'LnDfw eintragen
            Next inti
        End If
        
        'Verbesserungen durch Vorsatzschalen eintragen
        For inti = 1 To 4
            If clsFlanke(inti).DRwSR > 0 Then
                ActiveSheet.Rows(34 + (inti - 1) * 9).EntireRow.Hidden = False        'Zeilen einblenden
                ActiveSheet.Rows(35 + (inti - 1) * 9).EntireRow.Hidden = False        'Zeilen einblenden
                ActiveSheet.Rows(36 + (inti - 1) * 9).EntireRow.Hidden = False        'Zeilen einblenden
                ActiveSheet.Rows(65 + (inti - 1) * 3).EntireRow.Hidden = True         'Leerzeilen ausblenden
                ActiveSheet.Rows(66 + (inti - 1) * 3).EntireRow.Hidden = True         'Leerzeilen ausblenden
                ActiveSheet.Rows(67 + (inti - 1) * 3).EntireRow.Hidden = True         'Leerzeilen ausblenden
                Range("DRoben" & inti) = clsFlanke(inti).DRwSR
                Range("DRunten" & inti) = clsFlanke(inti).DRwER
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
        If bDIN4109 = True Then
            ' L'n,w für Massivholzdecken mit Unterdecken "Deckentyp(6)" nicht berechenbar
            ActiveSheet.[Lstrichnw_Decke] = IIf(clsDecke(1).Deckentyp = MHD_UD, "nicht berechenbar", clsDecke(1).Lnw + clsFlanke(1).K1 + clsFlanke(1).K2)
            ' R'w für Massivholzflanken "MHW" nicht berechenbar
            ActiveSheet.[Rstrichw_Decke] = IIf(clsFlanke(1).FlankentypSR = MHW Or clsFlanke(1).BeplankungSR = HWST, "nicht berechenbar", clsDecke(1).RStrichw)
            
        Else
            ActiveSheet.[Rstrichw_Decke] = clsDecke(1).RStrichw
            ActiveSheet.[Lstrichnw_Decke] = clsDecke(1).Lstrichnw
            
        End If
        
        
        
    ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    'Trennbauteil: Leichtbau, Flanke: Holzbau                        '
    ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    ElseIf .optWand = True And .optHolzbau = True Then
    
    End If
    
    'Tabellenblatt neu berechnen
    ActiveSheet.Calculate
            
    'Berechnungsergebnis als pdf abspeichern und anzeigen
    Call global_Function_Variables.PDF_Print_Sheet
'    Call global_Function_Variables.PDF_Print_Sheet
            
    End With
    
End Sub

