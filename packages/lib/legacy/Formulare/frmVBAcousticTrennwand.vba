
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''           Anwendungsoberfläche von VBAcousticTrennwand              '''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'
Option Explicit
'
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''            Deklaration der Variablen auf Modulebene                 '''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Public bStatuscmdgroesser10m2_Holz As Boolean, bStatuscmdkleiner10m2_Holz As Boolean, bStatuscmd0m2_Holz As Boolean


Private bFlanke As Boolean
Private bStatusDecke As Boolean
Private bStatusDach As Boolean
Private bStatusRwBerechnung As Boolean
Private bStatusdurchlaufend
Private bVS_hide As Boolean
Private dblVSSeite As Double
Private inti As Integer
Private intitems As Integer
Private strDachtyp As String
Private strStossstelle As String
Private strSR_ER As String
Private wshshell As Object





'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''                                                                                            ''''''''
'''''''''''''''''''''             #####     #############   ##########    ######               ########          ''''''''
'''''''''''''''''''''           ##     ##         #         #             #    ###                 #             ''''''''
'''''''''''''''''''''          ##       #         #         #             #      ##                #             ''''''''
'''''''''''''''''''''           ##                #         #             #      ##                #             ''''''''
'''''''''''''''''''''            ####             #         #             #    ###                 #             ''''''''
'''''''''''''''''''''               ####          #         #########     ######                   #             ''''''''
'''''''''''''''''''''                  ##         #         #             #                        #             ''''''''
'''''''''''''''''''''           #       ##        #         #             #                        #             ''''''''
'''''''''''''''''''''           ##     ##         #         #             #                        #             ''''''''
'''''''''''''''''''''             #####           #         ##########    #                     #######          ''''''''
'''''''''''''''''''''                                                                                            ''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''                                                                                            ''''''''
'''''''''''''''''''''            Anwendungsoberfläche  für VBAcoustic initialisieren                             ''''''''
'''''''''''''''''''''                                                                                            ''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

Private Sub UserForm_Initialize()

    Application.WindowState = xlMaximized

    With frmVBAcousticTrennwand

        'Auflösung kontrollieren, und Mindestgröße festlegen
        If bScaling = True Then
        
            intAppHeight = Application.Height
            intAppWidth = Application.Width
            
        ElseIf Application.Height < 558 And Application.Width < 1032 Then

            intAppHeight = 543: .ScrollHeight = intAppHeight            'Vertikale Bildlaufleiste einfügen
            intAppWidth = 1017: .ScrollWidth = intAppWidth              'Horizontale Bildlaufleiste einfügen
            .KeepScrollBarsVisible = fmScrollBarsBoth

        ElseIf Application.Height < 558 Then

            intAppWidth = 1017
            intAppHeight = 558: .ScrollHeight = intAppHeight            'Vertikale Bildlaufleiste einfügen
            .KeepScrollBarsVisible = fmScrollBarsVertical

        ElseIf Application.Width < 1032 Then

            intAppHeight = 543
            intAppWidth = 1032: .ScrollWidth = intAppWidth             'Horizontale Bildlaufleiste einfügen
            .KeepScrollBarsVisible = fmScrollBarsHorizontal

        Else

            intAppHeight = Application.Height
            intAppWidth = Application.Width
            .KeepScrollBarsVisible = fmScrollBarsNone                   'Bildlaufleisten ausblenden

        End If

        'Darstellung skalieren
        SetDeviceIndependentWindow Me

        'Anwendungsoberfläche auf Bildschirmgröße skalieren
        .Height = 0.98 * Application.Height
        .Width = 0.99 * Application.Width
        .Top = 0
        .Left = Application.Left

        .frmFlankenbauteil.Visible = False
        .frmFlankenbauteil.Visible = False
        .frmBausituation_Holz.Visible = False
        .frmFlankierendeBauteile0m2.Visible = False
        .frmFlankierendeBauteile10m2.Visible = False
        .WebBrowserPDF.Visible = False
        
    End With

End Sub


'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''                                                                                            ''''''''
'''''''''''''''''''             #####     #############   ##########    ######               ###########       ''''''''
'''''''''''''''''''           ##     ##         #         #             #    ###                 #  #          ''''''''
'''''''''''''''''''          ##       #         #         #             #      ##                #  #          ''''''''
'''''''''''''''''''           ##                #         #             #      ##                #  #          ''''''''
'''''''''''''''''''            ####             #         #             #    ###                 #  #          ''''''''
'''''''''''''''''''               ####          #         #########     ######                   #  #          ''''''''
'''''''''''''''''''                  ##         #         #             #                        #  #          ''''''''
'''''''''''''''''''           #       ##        #         #             #                        #  #          ''''''''
'''''''''''''''''''           ##     ##         #         #             #                        #  #          ''''''''
'''''''''''''''''''             #####           #         ##########    #                     ##########       ''''''''
'''''''''''''''''''                                                                                            ''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''                                                                                            ''''''''
'''''''''''''''''''            Programmsteuerung                                                               ''''''''
'''''''''''''''''''                                                                                            ''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''' Programmsteuerungsdialog initialisieren                                                    ''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Public Sub frmProgrammsteuerungTrennwand_Initialize()

    Dim intTopPOS As Integer
    Dim intSpace As Integer

    With frmVBAcousticTrennwand
        .frmProgrammsteuerung.Top = frmVBAcoustic.frmProgrammsteuerung.Top                  'Position vom oberen Bildschirmrand festlegen
        .frmProgrammsteuerung.Height = frmVBAcoustic.frmProgrammsteuerung.Height
        .frmProgrammsteuerung.Left = 0.99 * intAppWidth - .frmProgrammsteuerung.Width - 15  'Programmsteuerung nach rechts verschieben

        'Übernehmen der Voreinstellung frmProgramsteuerung aus frmVBAcoustic
        .ImgBauteil.Picture = IIf(frmVBAcoustic.optDecke = True, frmVBAcoustic.ImgDecke.Picture, frmVBAcoustic.ImgWand.Picture)
        .ImgBauteil.Visible = True
        
        .optManuell = IIf(frmVBAcoustic.optManuell = True, True, False)
        .optIFCeinlesen = IIf(frmVBAcoustic.optIFCeinlesen = True, True, False)

        .optHolzbau = IIf(frmVBAcoustic.optHolzbau = True, True, False)
        .optMassivbau = IIf(frmVBAcoustic.optMassivbau = True, True, False)

        .optDecke = IIf(frmVBAcoustic.optDecke = True, True, False)
        .optWand = IIf(frmVBAcoustic.optWand = True, True, False)

        .optFrequenzabhaengig = IIf(frmVBAcoustic.optFrequenzabhaengig = True, True, False)
        .optEinzahlwertDIN4109 = IIf(frmVBAcoustic.optEinzahlwertDIN4109 = True, True, False)
        .optEinzahlwertISO12354 = IIf(frmVBAcoustic.optEinzahlwertISO12354 = True, True, False)

        intSpace = (.frmProgrammsteuerung.Height - frmVBAcoustic.ImgDecke.Height - frmGebaeudeeingabe.Height _
        - frmBauweise.Height - frmTrennbauteil.Height - frmBerechnungsmethode.Height _
        - .cmdCancel.Height) / 7                                                    'Zwischenraumhöhe berechnen

        intTopPOS = intSpace + frmVBAcoustic.ImgDecke.Height + intSpace
        frmGebaeudeeingabe.Visible = False                                          'Einleseauswahl ausblenden

        intTopPOS = intTopPOS + frmGebaeudeeingabe.Height + intSpace
        frmBauweise.Visible = False                                                 'Bauweise ausblenden

        intTopPOS = intTopPOS + frmBauweise.Height + intSpace
        frmTrennbauteil.Visible = False                                             'Trennbauteiltyp ausblenden

        intTopPOS = intTopPOS + frmTrennbauteil.Height + intSpace
        frmBerechnungsmethode.Top = intTopPOS                                       'Rahmen der Optionsfelder platzieren

        intTopPOS = intTopPOS + frmBerechnungsmethode.Height + intSpace
        .cmdCancel.Top = intTopPOS                                                  'Rahmen der Optionsfelder platzieren
        .cmdBauteileingabe.Top = intTopPOS                                          'Rahmen der Optionsfelder platzieren

    End With
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''    Programmsteuerungsdialog: "Einzahlwertberechnung" oder "frequenzabhängige Berechnung" auswählen    '''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub optFrequenzabhaengig_Click()
    frmWarningMessage.Caption = "sorry"
    frmWarningMessage.Show
    optEinzahlwertISO12354 = True
End Sub
Private Sub optEinzahlwertDIN4109_Click()
    Application.Workbooks(VBAcoustic).Activate
    bDIN4109 = True
    frmVBAcoustic.optEinzahlwertDIN4109 = True
    With frmVBAcousticTrennwand
        If .WebBrowserPDF.Visible = True Then Call pdfclose
    End With
    Call frmProgrammsteuerungTrennwand_Initialize
    Call frmTrennWandHolzbau_Initialize
End Sub
Private Sub optEinzahlwertISO12354_Click()
    Application.Workbooks(VBAcoustic).Activate
    bDIN4109 = False
    frmVBAcoustic.optEinzahlwertISO12354 = True
    With frmVBAcousticTrennwand
        If .WebBrowserPDF.Visible = True Then Call pdfclose
    End With
    Call frmProgrammsteuerungTrennwand_Initialize
    Call frmTrennWandHolzbau_Initialize
End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''    Programmsteuerungsdialog: bei click "Bauteileingabe" bisherige Auswahl zurücksetzen   '''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cmdBauteileingabe_Click()
    frmVBAcousticTrennwand.cboWandtyp = ""
    Call frmTrennwandHolzbau_restart
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''    Programmsteuerungsdialog: Programmabbruch                   ''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cmdCancel_Click()
    Application.Workbooks(VBAcoustic).Activate
    Call application_Main.Programmsteuerung
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Beim "Wegklicken" der VBAcoustic Oberfläche auch Excel schließen        ''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub UserForm_QueryClose(Cancel As Integer, CloseMode As Integer)
    'ThisWorkbook.Saved = True
    'Application.Quit
End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''             #####     #############   ##########    ######             ##############      ''''''''
''''''''''''''''''''           ##     ##         #         #             #    ###               #  #  #         ''''''''
''''''''''''''''''''          ##       #         #         #             #      ##              #  #  #         ''''''''
''''''''''''''''''''           ##                #         #             #      ##              #  #  #         ''''''''
''''''''''''''''''''            ####             #         #             #    ###               #  #  #         ''''''''
''''''''''''''''''''               ####          #         #########     ######                 #  #  #         ''''''''
''''''''''''''''''''                  ##         #         #             #                      #  #  #         ''''''''
''''''''''''''''''''           #       ##        #         #             #                      #  #  #         ''''''''
''''''''''''''''''''           ##     ##         #         #             #                      #  #  #         ''''''''
''''''''''''''''''''             #####           #         ##########    #                   #############      ''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''            Bauteilauswahl:                                                                 ''''''''
''''''''''''''''''''                                - Trennbauteil:   Wandeingabe                               ''''''''
''''''''''''''''''''                                - Flanenbauteile: Flankeneingabe                            ''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''      #         #    #    #   #  ####   ####  #  #   #   ####     #    ####   ####          ''''''''
''''''''''''''''''''      #    #    #   # #   ##  #  #   #  #     #  ##  #  #        # #   #   #  #             ''''''''
''''''''''''''''''''      #   # #   #  #   #  # # #  #   #  ####  #  # # #  #  ###  #   #  ####   ####          ''''''''
''''''''''''''''''''       # #   # #   #####  #  ##  #   #  #     #  #  ##  #    #  #####  #   #  #             ''''''''
''''''''''''''''''''        #     #    #   #  #   #  ####   ####  #  #   #   ####   #   #  ####   ####          ''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''                         Bauteilauswahldialog initialisieren                                ''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Public Sub frmTrennWandHolzbau_Initialize()

    Dim TopNeu As Integer: TopNeu = 20  'Aktuelle obere Kante des neuen Rahmens

    With frmVBAcousticTrennwand

        'Platzieren des Hauptrahmens
        .frmTrennwandHolzbau.Top = 0                           'Position vom oberen Bildschirmrand festlegen
        .frmTrennwandHolzbau.Height = .Height - _
        IIf(Application.Width < 1032, 35, 30)                  'Rahmenhöhe festlegen
        .frmTrennwandHolzbau.Left = 0                          'Position vom linken Bildschirmrand festlegen
        
        'Rahmen Trennwandtyp
        .frmTrennwandtyp_Holz.Top = TopNeu                      'Position
         TopNeu = TopNeu + frmTrennwandtyp_Holz.Height + 10     'Neue Oberkannte des nächsten Rahmens
        If .cboWandtyp.ListCount = 0 Then                       'Trennwandtypen: Massivholzwand, Holzständerwand, Metallständerwand
            .cboWandtyp.AddItem MHW
            .cboWandtyp.AddItem HSTW
            .cboWandtyp.AddItem MSTW
        End If
        If .cboAnwendungstyp.ListCount = 0 Then                 'Anwendungstypen: Innenwand, Wohnungstrennwand, Gebäudetrennwand
            .cboAnwendungstyp.AddItem IW
            .cboAnwendungstyp.AddItem WTW
            .cboAnwendungstyp.AddItem WTW_2
            '.cboAnwendungstyp.AddItem GTW
        End If
        If .cboWandtyp = MSTW Then                              'Metallständerwände sind immer innenwände
            .cboAnwendungstyp.Text = IW
        End If
         

        'Rahmen Bauteilsammlung
        If clsWand(1).Wandtyp <> "" And clsWand(1).Anwendungstyp <> "" Then
            .frmBauteilsammlung_Holz.Visible = True             'Rahmen sichtbar
            
            If clsWand(1).Wandtyp = MHW And bDIN4109 = False Then
                .cmdRwBerechnen.Visible = True                  'Button "massenabhängige Berechnung" anzeigen
                .cmdTHRosenheimWand.Visible = True              'Bauteilkatalog TH-Ro anzeigen
                .cmdVaBDatWand.Visible = True                   'VaBDat anzeigen
                .cmdDataholzWand.Visible = True                 'Dataholz anzeigen
            
            ElseIf clsWand(1).Wandtyp = MSTW Then
                .cmdRwBerechnen.Visible = False                  'Button "massenabhängige Berechnung" nicht anzeigen
                .cmdTHRosenheimWand.Visible = False              'Bauteilkatalog TH-Ro nicht anzeigen
                .cmdVaBDatWand.Visible = False                   'VaBDat nicht anzeigen
                .cmdDataholzWand.Visible = False                 'Dataholz nicht anzeigen
            Else
                .cmdRwBerechnen.Visible = False                 'Button "massenabhängige Berechnung" nicht anzeigen
                .cmdTHRosenheimWand.Visible = True              'Bauteilkatalog TH-Ro anzeigen
                .cmdVaBDatWand.Visible = True                   'VaBDat anzeigen
                .cmdDataholzWand.Visible = True                 'Dataholz anzeigen
            End If
            
            .frmBauteilsammlung_Holz.Top = TopNeu               'Position
            TopNeu = TopNeu + frmBauteilsammlung_Holz.Height + 10   'Neue Oberkannte des nächsten Rahmens
        Else
            .frmBauteilsammlung_Holz.Visible = False             'Rahmen nicht sichtbar
        End If
        
        'Rahmen masseabhängige Rw Berechnung
        If bStatusRwBerechnung = True Then
            .frmBauteilsammlung_Holz.Visible = False             'Bauteilsammlung ausblenden
            TopNeu = TopNeu - frmBauteilsammlung_Holz.Height - 10 'Neue Oberkannte des nächsten Rahmens
            .frmRwTrennbauteil.Visible = True                   'Rahmen Masenabhängige Berechnung anzeigen
            .frmRwTrennbauteil.Top = TopNeu                     'Position
            TopNeu = TopNeu + .frmRwTrennbauteil.Height + 10    'Neue Oberkannte des nächsten Rahmens
        Else
            .frmRwTrennbauteil.Visible = False                  'Rahmen nicht sichtbar
        End If
        
        'Rahmen Installationsebenen
        If (bStatusRwBerechnung = True Or clsWand(1).DRw_ER Or clsWand(1).DRw_SR) And clsWand(1).Rw <> 0 Then
            .frmInst_Trennbt.Visible = True
            .frmInst_Trennbt.Top = TopNeu                       'Position
            TopNeu = TopNeu + .frmRwTrennbauteil.Height + 10    'Neue Oberkannte des nächsten Rahmens
        Else
            .frmInst_Trennbt.Visible = False
        End If
        
        'Rahmen Bausituation - Raumanordnung und Trennwandflächengröße
        If clsWand(1).Rw <> 0 Then
            .frmBausituation_Holz.Top = TopNeu                  'Position
            TopNeu = TopNeu + .frmBausituation_Holz.Height + 10 'Neue Oberkannte des nächsten Rahmens
            .frmBausituation_Holz.Visible = True
        Else
            .frmBausituation_Holz.Visible = False
        End If
        
        'Rahmen Flankensituationsbilder
        .frmFlankierendeBauteile0m2.Top = TopNeu                'Position
        .frmFlankierendeBauteile10m2.Top = TopNeu                'Position
        TopNeu = TopNeu + .frmFlankierendeBauteile0m2.Height + 10 'Neue Oberkannte des nächsten Rahmens

        If clsWand(1).Raumanordnung = OHNE_VERSATZ Or clsWand(1).Raumanordnung = MIT_VERSATZ Then
            .frmFlankierendeBauteile10m2.Visible = True
            .frmFlankierendeBauteile0m2.Visible = False
        ElseIf clsWand(1).Raumanordnung = DIAGONAL Then
            .frmFlankierendeBauteile10m2.Visible = False
            .frmFlankierendeBauteile0m2.Visible = True
            .cmdFlanke1_Holz_0m2.Visible = True
            If clsFlanke(1).FlankentypSR <> "" Then              'Zuerst Flanke 1 eigeben!
                .cmdFlanke2_Holz_0m2.Visible = True
            Else
                .cmdFlanke2_Holz_0m2.Visible = False
            End If
        Else
            .frmFlankierendeBauteile10m2.Visible = False
            .frmFlankierendeBauteile0m2.Visible = False
        End If
        
        'Flanken 1 bis 4 als ungedrückt markieren
        If .cboWandtyp = "" Then
            .cmdFlanke1_Holz.BackColor = &H8000000C: .cmdFlanke2_Holz.BackColor = &H8000000C
            .cmdFlanke3_Holz.BackColor = &H8000000C: .cmdFlanke4_Holz.BackColor = &H8000000C
            If clsFlanke(1).FlankentypSR = "" Then .cmdFlanke1_Holz_0m2.BackColor = &H8000000C
            If clsFlanke(2).FlankentypSR = "" Then .cmdFlanke2_Holz_0m2.BackColor = &H8000000C
        End If
        
        'Button Berechnungsstart anzeigen
        .cmdBerechnungsstart.Visible = IIf(.frmFlankierendeBauteile10m2.Visible = True Or .frmFlankierendeBauteile0m2.Visible = True, True, False)
        .cmdBerechnungsstart.Top = frmTrennwandHolzbau.Height - cmdBerechnungsstart.Height - 25

        'ggf. geöffnetes Ergebnis-pdf schließen
        If .WebBrowserPDF.Visible = True Then Call pdfclose
    
    End With

End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Bauteilauswahldialog: Vorbelegte Felder für Neustart zurücksetezen     ''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Sub frmTrennwandHolzbau_restart()
    
    With frmVBAcousticTrennwand
    
        'Trennwanddaten zurücksetzen
        .cboAnwendungstyp = ""
        .cmdBerechnungsstart.Visible = False
        .txtDRwER = ""
        .txtDRwSR = ""
        .txtRw_Holz = ""
        .frmRwTrennbauteil.Visible = False
        clsWand(1).Raumanordnung = ""
        
        'Flankendaten zurücksetzen
        '.txtRwFlanke = ""
        '.cboFlankentyp = ""
        '.txtRaumbreite_Holz = ""
        '.txtRaumhoehe_Holz = ""
        .frmFlankenbauteil.Visible = False
        .frmFlankierendeBauteile10m2.Visible = False
        .frmFlankierendeBauteile0m2.Visible = False
        .frmVS_Flanke.Visible = False
        .frmStossstelle.Visible = False
        .cmdFlanke1_Holz_0m2.Visible = False
        .cmdFlanke2_Holz_0m2.Visible = False
        intFlankenNr = 0
        Call ChangeFlankenBild(intFlankenNr, True)
        'Call txtRaumhoehe_Holz_change
        'Call txtRaumbreite_Holz_change
        'Call txtRaumhoehe0m2_Change
        
        'Flanken 1 bis 4 als ungedrückt markieren
        If .cboWandtyp = "" Then
            .cmdFlanke1_Holz.BackColor = &H8000000C: .cmdFlanke2_Holz.BackColor = &H8000000C
            .cmdFlanke3_Holz.BackColor = &H8000000C: .cmdFlanke4_Holz.BackColor = &H8000000C
            .cmdFlanke1_Holz_0m2.BackColor = &H8000000C: .cmdFlanke2_Holz_0m2.BackColor = &H8000000C
        End If

        .frmValidierung.Visible = False
        
        bStatuscmdgroesser10m2_Holz = False           'Status des Bautsituations-Button cmdgroesser10m2_Holz auf NICHT gedrückt schalten
        bStatuscmdkleiner10m2_Holz = False            'Status des Bautsituations-Button cmdkleiner10m2_Holz  auf NICHT gedrückt schalten
        bStatuscmd0m2_Holz = False                    'Status des Bautsituations-Button cmd0m2_Holz          auf NICHT gedrückt schalten
        bStatusDecke = False                          'Status der Flanke 4 Decke                             auf NICHT gedrückt schalten
        bStatusDach = False                           'Status der Flanke 4 Dach                              auf NICHT gedrückt schalten
        bStatusRwBerechnung = False                   'Status für Rw-Berechnungs-Button                      auf NICHT gedrückt schalten
        bFlanke = False                             'Flankeneingabe zurücksetzen
        bVS_hide = False                            'Variable zum Ausblenden der Vorsatzschel für Trockenbau&Massibau zurücksetzen
        
        
        Application.ActiveSheet.[Quelle_Trennbauteil] = ""                                 'Quelle löschen

        If frmVBAcousticTrennwand.WebBrowserPDF.Visible = True Then Call pdfclose           'ggf. geöffnetes Ergebnis-pdf schließen
    End With

End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Bauteilauswahldialog: Wandtyp                                  ''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cboWandtyp_Change()
    With frmVBAcousticTrennwand
        .cboWandtyp.BackColor = &H8000000F                'ggf. rote Hintrgrundfarbe zurücksetzen
        clsWand(1).Wandtyp = cboWandtyp.Text              'Wandtyp in Klasse abspeichern
        .txtRw_Holz = ""                                  'Bereits eingegebene Einzahlwerte zurücksetzen
        .txtmstrichTrennwand = ""                         'wenn Trennbauteil geändert wird, m' zurücksetzen
        .txtmstrichTrennbt = "-"
        bStatusRwBerechnung = False                       'Rw-Berechnungsfenster schließen
        Call frmTrennwandHolzbau_restart                  'Formatierung zurücksetzen
        Call frmTrennWandHolzbau_Initialize               'Formatierung aktualisieren
    End With
End Sub
Private Sub cboAnwendungstyp_Change()
    With frmVBAcousticTrennwand
        .cboAnwendungstyp.BackColor = &H8000000F          'ggf. rote Hintrgrundfarbe zurücksetzen
        clsWand(1).Anwendungstyp = cboAnwendungstyp.Text  'Anwendungtyp in Klasse abspeichern
        If clsWand(1).Rw > 0 Then Call frmTrennwandHolzbau_restart  'Neueingabe bei nachträglicher Änderung des Anwendungstyps
        Call frmTrennWandHolzbau_Initialize               'Formatierung aktualisieren
    End With
End Sub



''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Bauteilauswahldialog: Bauteildatenbanken öffnen                                            ''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cmdDataholzWand_Click()
    Set wshshell = CreateObject("WScript.Shell")
    wshshell.Run "https://www.dataholz.eu/bauteile/trennwand.htm"
End Sub
Private Sub cmdDIN4109Wand_Click()
    Application.ScreenUpdating = False                                                  ' im Hintergrund ohne Anzeige
    Application.Workbooks(VBAcoustic).Activate
    If frmVBAcousticTrennwand.WebBrowserPDF.Visible = True Then Call pdfclose        'ggf. geöffnetes Ergebnis-PDF schließen
    BTK_DIN4109_33 = openfile("Bauteilkatalog_DIN4109_33.xlsm")                         'Datei zum Bauteilkatalog DIN4109-33 öffnen
    Application.Workbooks(VBAcoustic).Activate
    
    'Bauteilkatalog "Wände" darstellen und Bauteil auswählen/einlesen
    Application.Run "Bauteilkatalog_DIN4109_33.xlsm!DIN4109_33_Waende", _
    frmVBAcousticTrennwand.cboWandtyp, frmVBAcousticTrennwand.cboAnwendungstyp, _
    frmVBAcousticTrennwand.Left, VBAcoustic
    
    Application.ScreenUpdating = True
    Application.Workbooks("Bauteilkatalog_DIN4109_33.xlsm").Close                       'Datei schließen
    Application.Workbooks(VBAcoustic).Activate                                           'VBAcoustic aktiv setzen
End Sub
Private Sub cmdTHRosenheimWand_Click()
    Application.ScreenUpdating = False                                                  'im Hintergrund ohne Anzeige
    Application.Workbooks(VBAcoustic).Activate
    If frmVBAcousticTrennwand.WebBrowserPDF.Visible = True Then Call pdfclose           'ggf. geöffnetes Ergebnis-PDF schließen
    BTK_TH_Rosenheim = openfile("Bauteilkatalog_TH_Rosenheim.xlsm")                     'Datei zum Bauteilkatalog TH Rosenheim öffnen
    Application.Workbooks(VBAcoustic).Activate
    
    'Bauteilkatalog "Wände" darstellen und Bauteil auswählen/einlesen
    Application.Run "Bauteilkatalog_TH_Rosenheim.xlsm!TH_Rosenheim_Waende", _
    frmVBAcousticTrennwand.cboWandtyp, frmVBAcousticTrennwand.cboAnwendungstyp, _
    frmVBAcousticTrennwand.Left, VBAcoustic
    
    Application.ScreenUpdating = True
    Application.Workbooks("Bauteilkatalog_TH_Rosenheim.xlsm").Close                     'Datei schließen
    Workbooks(VBAcoustic).Activate                                                      'VBAcoustic aktiv setzen

End Sub



'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''  Nach Abschluss der Bauteilauswahl: Unterscheidung zw. Flanken- und Trennbauteil Eingabe zurücksetzen  '''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Public Sub bFlanke_change(bFlankeubergeben As Boolean)
    bFlanke = bFlankeubergeben
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Rw Einzahlwerte direkt eingeben                                                ''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub txtRw_Holz_Change()
    With frmVBAcousticTrennwand
        .txtRw_Holz.BackColor = &H8000000F                          'ggf. rote Hintrgrundfarbe zurücksetzen
        clsWand(1).Rw = IIf(IsNumeric(.txtRw_Holz), .txtRw_Holz, 0) 'Datenübergabe an Wandobjekt
        Call frmTrennWandHolzbau_Initialize                         'Formatierung aktualisieren
    End With
End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''            Rw Berechnung mit flächenbezogener Masse                   ''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cmdRwBerechnen_Click()
    With frmVBAcousticTrennwand
        bStatusRwBerechnung = True
        Call frmTrennWandHolzbau_Initialize
    End With
End Sub
Private Sub txtmstrichTrennwand_change()
    With frmVBAcousticTrennwand
    
        'Übergabe der flächenbezogenen Masse
        .txtmstrichTrennbt = .txtmstrichTrennwand    'an Stoßstellenberechnung
        frmf0.txtmGW = .txtmstrichTrennwand          'an VS-Eingabe
        clsWand(1).WandmasseTbt = IIf(IsNumeric(.txtmstrichTrennwand), .txtmstrichTrennwand, 0) 'an Wandobjekt
        
        'Berechnung der Schalldämmung aus der flächenbezogenen Masse
        If clsWand(1).Wandtyp = MHW Then
            If .txtmstrichTrennwand >= 35 And txtmstrichTrennwand <= 160 Then
                clsWand(1).Rsw = Round(Rw_HB(.txtmstrichTrennwand), 1)
                clsWand(1).Rw = clsWand(1).Rsw + calcDRijw(clsWand(1).DRw_SR, clsWand(1).DRw_ER)
                .txtRw_Holz = clsWand(1).Rw

            ElseIf .txtmstrichTrennwand <= 16 Or .txtmstrichTrennwand = "" Then
                'auf nächste Ziffer warten
            Else
                .txtRw_Holz = ""
                 Call frmWarningMessage.WarningMessage("Berechnung für diese Masse nicht möglich", "Warning")
            End If
        End If

    End With
End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' DRw Berechnung der Installationsebene (Senderaumseite und Empfangsraumseite)  '''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cmdAuswahlInstSR_Click()
    frmf0.txtmGW = clsWand(1).WandmasseTbt
    frmf0.Show
    If frmf0.txtd = "" Then frmf0.txtd = 0
    If frmf0.txts = "" Then frmf0.txts = 0
    frmVBAcousticTrennwand.txtDRwSR = calc_Massivbau_single.DRwVSSchale(frmf0.txtd, frmf0.txts, frmf0.txtmGW, frmf0.txtmVS, clsWand(1).Rsw)
End Sub
Private Sub txtDRwSR_Change()
    With frmVBAcousticTrennwand
       clsWand(1).DRw_SR = IIf(IsNumeric(.txtDRwSR), .txtDRwSR, 0)
       clsWand(1).Rw = clsWand(1).Rsw + calc_Holzbau_single.calcDRijw(clsWand(1).DRw_SR, clsWand(1).DRw_ER)
       .txtRw_Holz = clsWand(1).Rw
    End With
    Call frmVBAcousticTrennwand.frmTrennWandHolzbau_Initialize
End Sub
Private Sub cmdAuswahlInstER_Click()
    frmf0.txtmGW = clsWand(1).WandmasseTbt
    frmf0.Show
    If frmf0.txtd = "" Then frmf0.txtd = 0
    If frmf0.txts = "" Then frmf0.txts = 0
    frmVBAcousticTrennwand.txtDRwER = calc_Massivbau_single.DRwVSSchale(frmf0.txtd, frmf0.txts, frmf0.txtmGW, frmf0.txtmVS, clsWand(1).Rsw)
End Sub
Private Sub txtDRwER_Change()
    With frmVBAcousticTrennwand
       clsWand(1).DRw_ER = IIf(IsNumeric(.txtDRwER), .txtDRwER, 0)
       clsWand(1).Rw = clsWand(1).Rsw + calc_Holzbau_single.calcDRijw(clsWand(1).DRw_SR, clsWand(1).DRw_ER)
       .txtRw_Holz = clsWand(1).Rw
    End With
    Call frmVBAcousticTrennwand.frmTrennWandHolzbau_Initialize
End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''            Festlegung der Raumandornung                  ''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''       Raumanordnung ohne oder mit geringem Versatz zwischen Sende und Empfangsraum       '''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cmdgroesser10m2_Holz_Click()
    With frmVBAcousticTrennwand
        clsWand(1).Raumanordnung = OHNE_VERSATZ
        Call frmTrennWandHolzbau_Initialize
    End With
End Sub
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''             Raumanordnung mit Versatz > 0,5 m                  ''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cmdkleiner10m2_Holz_Click()
     With frmVBAcousticTrennwand
        clsWand(1).Raumanordnung = MIT_VERSATZ
        Call frmTrennWandHolzbau_Initialize
    End With
End Sub
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''             Trennfläche = 0m2                                 '''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cmd0m2_Holz_Click()
     With frmVBAcousticTrennwand
        clsWand(1).Raumanordnung = DIAGONAL
        Call frmTrennWandHolzbau_Initialize
    End With
End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''               Eingabe von Raumhöhe und Raumbreite                     ''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub txtRaumbreite_Holz_change()
    With frmVBAcousticTrennwand
        .txtRaumbreite_Holz.BackColor = &H8000000F
        If IsNumeric(.txtRaumbreite_Holz) = True Then
            clsWand(1).Raumbreite = .txtRaumbreite_Holz
            clsWand(1).Flaeche = clsWand(1).Raumbreite * clsWand(1).Raumhoehe
            clsFlanke(3).lfSR = .txtRaumbreite_Holz
            clsFlanke(4).lfSR = .txtRaumbreite_Holz
        Else
            clsWand(1).Raumbreite = 0
            clsFlanke(3).lfSR = 0: clsFlanke(2).lfER = 0
            clsFlanke(4).lfSR = 0: clsFlanke(4).lfER = 0

        End If
        Call frmVBAcousticTrennwand.frmTrennWandHolzbau_Initialize
    End With
End Sub
Private Sub txtRaumhoehe_Holz_change()
    With frmVBAcousticTrennwand
        .txtRaumhoehe_Holz.BackColor = &H8000000F
        If IsNumeric(.txtRaumhoehe_Holz) = True Then
            clsWand(1).Raumhoehe = .txtRaumhoehe_Holz
            clsWand(1).Flaeche = clsWand(1).Raumbreite * clsWand(1).Raumhoehe
            clsFlanke(1).lfSR = .txtRaumhoehe_Holz
            clsFlanke(2).lfSR = .txtRaumhoehe_Holz
        Else
            clsWand(1).Raumhoehe = 0
            clsFlanke(1).lfSR = 0
            clsFlanke(2).lfSR = 0
        End If
        Call frmVBAcousticTrennwand.frmTrennWandHolzbau_Initialize
    End With
End Sub
Private Sub txtRaumhoehe0m2_Change()
    With frmVBAcousticTrennwand
        .txtRaumhoehe0m2.BackColor = &H8000000F
        If IsNumeric(.txtRaumhoehe0m2) = True Then
            clsWand(1).Raumhoehe = .txtRaumhoehe0m2
            clsFlanke(1).lfSR = .txtRaumhoehe0m2
            clsFlanke(2).lfSR = .txtRaumhoehe0m2
        Else
            clsFlanke(1).lfSR = 0
            clsFlanke(2).lfSR = 0
            clsWand(1).Raumhoehe = 0
        End If
        Call frmVBAcousticTrennwand.frmTrennWandHolzbau_Initialize
    End With
End Sub


'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''   ####  #        #    #   #  #  #  ####  #   #  ####  #  #   #   ####     #    ####   ####   '''''''
''''''''''''''''''''   #     #       # #   ##  #  # #   #     ##  #  #     #  ##  #  #        # #   #   #  #      '''''''
''''''''''''''''''''   ####  #      #   #  # # #  ##    ####  # # #  ####  #  # # #  #  ###  #   #  ####   ####   '''''''
''''''''''''''''''''   #     #      #####  #  ##  # #   #     #  ##  #     #  #  ##  #    #  #####  #   #  #      '''''''
''''''''''''''''''''   #     #####  #   #  #   #  #  #  ####  #   #  ####  #  #   #   ####   #   #  ####   ####   '''''''
''''''''''''''''''''                                                                                              '''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''         Auswahl der Flankenbauteile       '''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cmdFlanke1_Holz_Click()
    intFlankenNr = 1
    Call FlankenNr_init(intFlankenNr)                   'Nummer setzen und Flanke initialisieren
    cmdFlanke1_Holz.BackColor = &H8000000F                                'ggf. rote Hintrgrundfarbe zurücksetzen
End Sub
Private Sub cmdFlanke2_Holz_Click()
    intFlankenNr = 2
    Call FlankenNr_init(intFlankenNr)                   'Nummer setzen und Flanke initialisieren
    cmdFlanke2_Holz.BackColor = &H8000000F                                'ggf. rote Hintrgrundfarbe zurücksetzen
End Sub
Private Sub cmdFlanke3_Holz_Click()
    intFlankenNr = 3
    Call FlankenNr_init(intFlankenNr)                   'Nummer setzen und Flanke initialisieren
    cmdFlanke3_Holz.BackColor = &H8000000F                                'ggf. rote Hintrgrundfarbe zurücksetzen
End Sub
Private Sub cmdFlanke4_Holz_Click()
    intFlankenNr = 4
    Call FlankenNr_init(intFlankenNr)                   'Nummer setzen und Flanke initialisieren
    cmdFlanke4_Holz.BackColor = &H8000000F                                'ggf. rote Hintrgrundfarbe zurücksetzen
End Sub
Private Sub cmdFlanke1_Holz_0m2_click()
    intFlankenNr = 1
    Call FlankenNr_init(intFlankenNr)                   'Nummer setzen und Flanke initialisieren
    cmdFlanke1_Holz_0m2.BackColor = &H8000000F                            'ggf. rote Hintrgrundfarbe zurücksetzen
End Sub
Private Sub cmdFlanke2_Holz_0m2_click()
    intFlankenNr = 2
    Call FlankenNr_init(intFlankenNr)                   'Nummer setzen und Flanke initialisieren
    cmdFlanke2_Holz_0m2.BackColor = &H8000000F                            'ggf. rote Hintrgrundfarbe zurücksetzen
End Sub
Private Sub FlankenNr_init(intFlankenNr As Integer)
    Call ChangeFlankenBild(intFlankenNr, False)
    With frmVBAcousticTrennwand
        If (.txtRaumbreite_Holz <> "" And .txtRaumhoehe_Holz <> "") Or _
           (clsWand(1).Raumanordnung = DIAGONAL And .txtRaumhoehe0m2 <> "") Then
            Call frmFlankeHolzbau_restart
            Call frmFlankenbauteil_Holz_Initialize(intFlankenNr)
        Else
            .txtRaumbreite_Holz.BackColor = vbRed
            .txtRaumhoehe_Holz.BackColor = vbRed
            .txtRaumhoehe0m2.BackColor = vbRed
            Call ChangeFlankenBild(intFlankenNr, True)
        End If
    End With
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' 3D Flankendarstellung anpassen                                                             ''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub ChangeFlankenBild(intFlankenNr As Integer, bReset As Boolean)
    With frmVBAcousticTrennwand
        If bReset = False Then
            If clsWand(1).Raumanordnung = DIAGONAL Then
                .ImgFlankensituation0m2.Picture = LoadPicture("")
                .ImgFlankensituation0m2.Picture = .Controls("imgDiagonal" & intFlankenNr).Picture
            Else
                .ImgFlankensituation10m2.Picture = LoadPicture("")
                .ImgFlankensituation10m2.Picture = .Controls("imgFlanke" & intFlankenNr).Picture
            End If
        Else
        'Flankenbild zuruecksetzen
            If clsWand(1).Raumanordnung = DIAGONAL Then
                .ImgFlankensituation0m2.Picture = LoadPicture("")
                .ImgFlankensituation0m2.Picture = .imgDiagonalBlank.Picture
            Else
                .ImgFlankensituation10m2.Picture = LoadPicture("")
                .ImgFlankensituation10m2.Picture = .imgFlankenBlank.Picture
            End If
        End If
    End With
End Sub

 
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''                                                                                            ''''''''''''''''
''''''''''''                   Flankenauswahldialog initialisieren                                      ''''''''''''''''
''''''''''''                                                                                            ''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub frmFlankenbauteil_Holz_Initialize(intFlankenNr As Integer)

    Dim TopNeu As Integer: TopNeu = 20  'Aktuelle obere Kante des neuen Rahmens

    With frmVBAcousticTrennwand
    
        '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
        '''''''' 1. Dialogahmenebene initialisieren '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
        '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
        'Haupt-Dialograhmen
        .frmFlankenbauteil.Visible = True
        .frmFlankenbauteil.Left = .frmTrennwandHolzbau.Left + .frmTrennwandHolzbau.Width
        .frmFlankenbauteil.Top = 0
         
        'Dialograhmen zum Flankentyp initialisieren und anzeigen
        .frmFlankenbauteiltyp.Visible = True
        .frmFlankenbauteiltyp.Top = TopNeu                      'Position
        TopNeu = TopNeu + frmFlankenbauteiltyp.Height + 10      'Neue Oberkannte des nächsten Rahmens
        
        'Auswahl Flankentyp initialisieren
        If intFlankenNr = 1 Or intFlankenNr = 2 Then            'Vorbelegung der Flankentyp-Auswahl
            
            If clsWand(1).Raumanordnung = DIAGONAL And intFlankenNr = 1 Then
                 .cboFlankentyp = .cboWandtyp                   'Trennwand = Flankenwand!
                 .txtmstrichFlanke = 0: .txtmstrichFlanke = clsWand(1).WandmasseTbt
                 .txtDRwSR_Flanke = clsWand(1).DRw_SR
                 .txtDRwER_Flanke = clsWand(1).DRw_ER
                 
            ElseIf clsWand(1).Raumanordnung = DIAGONAL Then
                 .cboFlankentyp.List = Array(MHW, HSTW, MSTW)    'Wandtypen: Massivholzwand, Holzständerwand, Metallständerwand
            Else
                .cboFlankentyp.List = Array(MW, MHW, HSTW, MSTW)    'Wandtypen: Massivwand, Massivholzwand, Holzständerwand, Metallständerwand
            End If
            
        ElseIf intFlankenNr = 3 Then
            
            .cboFlankentyp.List = Array(SBD, MHD, HBD)          'Bodentypen: Stahlbetondecke, Massivholzdecke, Holzbalkendecke
            
        Else
            .cboFlankentyp.List = Array(SBD, MHD, HBD, SB_FlACHD, MH_FLACHD, HB_FLACHD) 'Deckentypen: Stahlbetondecke, Massivholzdecke, Holzbalkendecke
                                                    
                                                                                        'Dachtypen: Stahlbeton-Flachdach, Massivholz -Flachdach, Sparrendach (Flachdach), Sparrendach (Steildach)
        End If
        
        'Raumversatz und Symmetrie überprüfen
        If (clsWand(1).Raumanordnung = OHNE_VERSATZ) Then
            .chkOhneVersatz = True
            .chkOhneVersatz.Visible = False
            .chkSymmetrie = True
        ElseIf (clsWand(1).Raumanordnung = DIAGONAL) Then
            .chkOhneVersatz = True
            .chkOhneVersatz.Visible = False
            .chkSymmetrie = True
        Else
            .chkOhneVersatz.Visible = True
        End If
        
        ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
        '''''''' Nächste Dialograhmen-Ebene in Abhängikeit des gewälten Flankentyps einblenden '''''''''''''''''''''''
        ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
        If .cboFlankentyp <> "" Then
            
            ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
            '''' Bauweise (Baumaterial) der Flanke abfragen ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
            ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
            'Abfrage der Bauweise für Massivholzdecken oder -dächer (Massivholzelement, Massivholzelement+Schüttung,HBV Element)
            If .cboFlankentyp = MHD Or .cboFlankentyp = MH_FLACHD Then
                .frmBauweiseMassivwand.Visible = True
                
                .cboMaterial.List = Array(MHE, MHE_SPLITT, MHE_HBV) 'Bauweisen: Massivholzelement, Massivholzelement+Schüttung,HBV Element
                
                .frmBauweiseMassivwand.Top = TopNeu                   'Position
                 TopNeu = TopNeu + frmBauweiseMassivwand.Height + 10  'Neue Oberkannte des nächsten Rahmens
            
            'Abfrage der Bauweise für Massivwände (Beton,KS-Stein,Mauerziegel, Leichtbeton, Porenbeton)
            ElseIf .cboFlankentyp = MW Then
                .frmBauweiseMassivwand.Visible = True
                
                .cboMaterial.List = Array(SB_KS_MZ, LEICHTB, PORENB) 'Bauweisen: Beton,KS-Stein,Mauerziegel, Leichtbeton, Porenbeton
                
                .frmBauweiseMassivwand.Top = TopNeu                   'Position
                 TopNeu = TopNeu + frmBauweiseMassivwand.Height + 10  'Neue Oberkannte des nächsten Rahmens
                             
            'Für Stahlbetondecken wird das Material direkt gesetzt.
            ElseIf .cboFlankentyp = SBD Or .cboFlankentyp = SB_FlACHD Then
                .cboMaterial = "Beton"
                .frmBauweiseMassivwand.Visible = False
            
            'Für Leichtbauflanken Dialograhmen nicht anzeigen
            Else
                .frmBauweiseMassivwand.Visible = False
            End If
            
            ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
            '''' Planungswert (Rw oder Dn,f,w) der Flanke abfragen '''''''''''''''''''''''''''''''''''''''''''''''''''
            ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
            'Dialograhmen für die Schalldämmung Rw des Grundbauteils (Massiv oder Massivholzflanke)
            If (bMassivholzFlanke = True Or bMassivFlanke = True) And .txtmstrichFlanke <> "" Then
                If bMassivFlanke = True Then
                    .lblWandbeschreibung = "  Flanke ohne Vorsatzkonstruktion"
                Else
                    .lblWandbeschreibung = "  Grundelement inkl.Direktbeplankung"
                End If
                .frmRiw_Grundbauteil.Visible = True
                .frmRiw_Grundbauteil.Top = TopNeu                   'Position
                 TopNeu = TopNeu + frmRiw_Grundbauteil.Height + 10  'Neue Oberkannte des nächsten Rahmens
            Else
                .frmRiw_Grundbauteil.Visible = False
            End If
            
            'Dialograhmen für die Norm-Flankenpegeldifferenz Dn,f,w der Leichtbauflanken (Holztafelbau oder Metallständewände)
            If bLeichtbauFlanke = True And .chkOhneVersatz = True Then
                .frmDnfwFlanke.Visible = True
                .frmDnfwFlanke.Top = TopNeu                   'Position
                 TopNeu = TopNeu + frmDnfwFlanke.Height + 10  'Neue Oberkannte des nächsten Rahmens
            Else
                .frmDnfwFlanke.Visible = False
            End If
            

            ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
            '''' Bauteilkataloge für Leichtbauflanken einblenden '''''''''''''''''''''''''''''''''''''''''''''''''''''
            ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
            If bLeichtbauFlanke = True And bMassivholzFlanke = False And .txtRwFlanke = "" And .chkOhneVersatz = True Then
                .frmBauteilsammlung_Flanke.Visible = True
                .frmBauteilsammlung_Flanke.Top = TopNeu                   'Position
                 TopNeu = TopNeu + frmBauteilsammlung_Flanke.Height + 10  'Neue Oberkannte des nächsten Rahmens
                .cmdRwBerechnen_Flanke.Visible = IIf(.cboFlankentyp = MHW, True, False)
            Else
                .frmBauteilsammlung_Flanke.Visible = False
            End If
            
            ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
            '''' Abfrage der flächenbezogenen Masse zur masseabhängige Berechnung von Rw für Massiv(holz)Flanken '''''
            ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
            If (bMassivFlanke = True And (.txtmstrichFlanke <= 72 Or .txtmstrichFlanke = "")) Or _
               (bMassivholzFlanke = True And (.txtmstrichFlanke <= 16 Or .txtmstrichFlanke = "")) Then
                .frmBauteilsammlung_Flanke.Visible = False             'Bauteilsammlung ausblenden
                If bMassivFlanke = True Then
                    .lblRwBerechnungMassivFlanke1.Visible = True
                    .lblRwBerechnungMassivFlanke2.Visible = True
                    .lblRwBerechnungHolzFlanke1.Visible = False
                    .lblRwBerechnungHolzFlanke2.Visible = False
                Else
                    .lblRwBerechnungMassivFlanke1.Visible = False
                    .lblRwBerechnungMassivFlanke2.Visible = False
                    .lblRwBerechnungHolzFlanke1.Visible = True
                    .lblRwBerechnungHolzFlanke2.Visible = True
                    If .cboFlankentyp = MHW Then
                        .lblRwBerechnungHolzFlanke1.Caption = "Berechnung für Massivholzwände mit "
                        .lblRwBerechnungHolzFlanke2.Caption = "35 kg/m² < m'< 160 kg/m² inkl. Beplankung"
                    ElseIf .cboMaterial <> "" Then
                        If .cboMaterial = MHE Then
                            .lblRwBerechnungHolzFlanke1.Caption = "Näherungsweise Prognose für Massivholzelemente:"
                            .lblRwBerechnungHolzFlanke2.Caption = "35 kg/m² < m' < 100 kg/m²"

                        ElseIf .cboMaterial = MHE_SPLITT Then
                            .lblRwBerechnungHolzFlanke1.Caption = "Näherungsweise Prognose für Massivholzelemente"
                            .lblRwBerechnungHolzFlanke2.Caption = "mit Schüttung: 140 kg/m² < m' < 250 kg/m²"
                        Else
                            .lblRwBerechnungHolzFlanke1.Caption = "Näherungsweise Prognose für Holz-Beton-Verbund"
                            .lblRwBerechnungHolzFlanke2.Caption = "Elemente: 180 kg/m² < m' < 500 kg/m²"
                        End If
                        
                    End If
                End If
                If (.cboFlankentyp = MHD Or .cboFlankentyp = MH_FLACHD) And .cboMaterial = "" Then
                        .lblRwBerechnungHolzFlanke1.Visible = False
                        .lblRwBerechnungHolzFlanke2.Visible = False
                        .frmRwflankenbauteil.Visible = False
                Else
                    .frmRwflankenbauteil.Visible = True               'Rahmen Masenabhängige Berechnung anzeigen
                    .frmRwflankenbauteil.Top = TopNeu                     'Position
                    TopNeu = TopNeu + .frmRwflankenbauteil.Height + 10    'Neue Oberkannte des nächsten Rahmens
                End If
            Else
                .frmRwflankenbauteil.Visible = False                  'Rahmen nicht sichtbar
            End If
            
            ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
            '''' Stoßstellen für Massiv(holz)Flanken auswählen '''''''''''''''''''''''''''''''''''''''''''''''''''''''
            ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
            If (bMassivholzFlanke = True Or bMassivFlanke = True) And _
               (.txtRwFlanke <> "") And (clsWand(1).Raumanordnung <> DIAGONAL) Then
               
                .frmStossstelle.Visible = True                      'Rahmen Stoßstelle anzeigen
                .frmStossstelle.Top = TopNeu                        'Position
              
                'Flankierende Mauerwerkswände, Betonwände und Stahlbetondecken
                If bMassivFlanke = True Then
                
                    If .cboStossstellenGrundlage.ListCount = 0 Then
                        .cboStossstellenGrundlage.AddItem DIN4109_32
                    End If
                    
                    .frmStossWandWand.Visible = False: .frmStossWandDeckeBoden.Visible = False
                    .frmStossWandWandGetrennt.Visible = False
                    .frmStossVersatzLinks.Visible = False: .frmStossVersatzRechts.Visible = False
                    .frmKij.Visible = False
                    .frmKijmin.Visible = True: .frmKijmin.Top = .cboStossstellenGrundlage.Top + 35
                    .cboStossstellenGrundlage = DIN4109_32

                'Flankierende Massivholzwände
                ElseIf .cboFlankentyp = MHW Then           'Auswahlbuttons Stoßausführung anzeigen
                
                    If .cboStossstellenGrundlage.ListCount = 0 Then
                        .cboStossstellenGrundlage.AddItem DIN_EN_ISO12354
                        .cboStossstellenGrundlage.AddItem DIN4109_33
                        .cboStossstellenGrundlage.AddItem VIBROAKUSTIK
                    End If
                    
                    cboStossstellenGrundlage = VIBROAKUSTIK 'Vorbelegung
                    
                       
                    If clsWand(1).Raumanordnung = MIT_VERSATZ And intFlankenNr = 1 And .chkOhneVersatz = False Then
                        .frmStossVersatzLinks.Visible = IIf(.cboStossstellenGrundlage <> "", True, False)
                        .frmStossVersatzLinks.Top = .cboStossstellenGrundlage.Top + .cboStossstellenGrundlage.Height + 5
                        .frmStossWandDeckeBoden.Visible = False
                        .frmStossWandDeckeBodenGetrennt.Visible = False
                        .frmStossWandWand.Visible = False
                        .frmStossWandWandGetrennt.Visible = False
                    ElseIf clsWand(1).Raumanordnung = MIT_VERSATZ And intFlankenNr = 2 And .chkOhneVersatz = False Then
                        .frmStossVersatzRechts.Visible = IIf(.cboStossstellenGrundlage <> "", True, False)
                        .frmStossVersatzRechts.Top = .cboStossstellenGrundlage.Top + .cboStossstellenGrundlage.Height + 5
                        .frmStossWandDeckeBoden.Visible = False
                        .frmStossWandDeckeBodenGetrennt.Visible = False
                        .frmStossWandWand.Visible = False
                        .frmStossWandWandGetrennt.Visible = False
                    ElseIf .cboAnwendungstyp = WTW_2 Then 'zweischalige Wohnungstrennwand
                        .frmStossWandWandGetrennt.Visible = IIf(.cboStossstellenGrundlage <> "", True, False)
                        .frmStossWandWand.Visible = False
                        .frmStossWandDeckeBodenGetrennt.Visible = False
                        .frmStossWandDeckeBoden.Visible = False
                        .frmStossVersatzLinks.Visible = False
                        .frmStossVersatzRechts.Visible = False
                        .frmStossWandWandGetrennt.Top = .cboStossstellenGrundlage.Top + .cboStossstellenGrundlage.Height + 15
                        If .chkOhneVersatz.Visible = True Then .frmStossWandWandGetrennt.Top = .frmStossWandWandGetrennt.Top + 20
                    Else
                        .frmStossWandWand.Visible = IIf(.cboStossstellenGrundlage <> "", True, False)
                        .frmStossWandDeckeBoden.Visible = False
                        .frmStossWandDeckeBodenGetrennt.Visible = False
                        .frmStossVersatzLinks.Visible = False
                        .frmStossVersatzRechts.Visible = False
                        .frmStossWandWandGetrennt.Visible = False
                        .frmStossWandWand.Top = .cboStossstellenGrundlage.Top + .cboStossstellenGrundlage.Height + 15
                        If .chkOhneVersatz.Visible = True Then .frmStossWandWand.Top = .frmStossWandWand.Top + 20
                    End If
                    
                    .frmKijmin.Visible = False
                    .frmKijminVersatz.Visible = False
                    
                'Flankierende Massivholz-Decken oder -Dachelemente
                Else
                    If .cboStossstellenGrundlage.ListCount = 0 Then
                        If (.cboMaterial <> MHE_HBV) Then .cboStossstellenGrundlage.AddItem DIN_EN_ISO12354
                        .cboStossstellenGrundlage.AddItem DIN4109_33
                        .cboStossstellenGrundlage.AddItem VIBROAKUSTIK
                    End If
                    
                    .chkOhneVersatz.Visible = False
                    
                    If .cboAnwendungstyp = WTW_2 Then 'zweischalige Wohnungstrennwand
                        .frmStossWandDeckeBodenGetrennt.Visible = IIf(.cboStossstellenGrundlage <> "", True, False)
                        .frmStossWandDeckeBodenGetrennt.Top = .cboStossstellenGrundlage.Top + .cboStossstellenGrundlage.Height + 15
                        .frmStossWandDeckeBoden.Visible = False
                        .frmStossWandWand.Visible = False
                        .frmStossWandWandGetrennt.Visible = False
                        .frmStossVersatzRechts.Visible = False
                        .frmStossVersatzLinks.Visible = False
                        .frmKijmin.Visible = False
                        .frmKijminVersatz.Visible = False

                    Else 'einschalige Wand
                        .frmStossWandDeckeBoden.Visible = IIf(.cboStossstellenGrundlage <> "", True, False)
                        .frmStossWandDeckeBoden.Top = .cboStossstellenGrundlage.Top + .cboStossstellenGrundlage.Height + 15
                        .frmStossWandDeckeBodenGetrennt.Visible = False
                        .frmStossWandWand.Visible = False
                        .frmStossWandWandGetrennt.Visible = False
                        .frmStossVersatzRechts.Visible = False
                        .frmStossVersatzLinks.Visible = False
                        .frmKijmin.Visible = False
                        .frmKijminVersatz.Visible = False
                   End If
                End If
                
                'Ergebnisse für Kij anzeigen
                If .txtKFf <> "" And .txtKijmin = "" Then
                    If (intFlankenNr = 1 Or intFlankenNr = 2) And .chkOhneVersatz = False Then 'Wände mit Versatz
                        .frmKij.Top = .cboStossstellenGrundlage.Top + 35 + .frmStossVersatzLinks.Height
                        .frmStossstelle.Height = .frmKij.Top + .frmKij.Height
                    ElseIf (intFlankenNr = 3 Or intFlankenNr = 4) Then 'Decke, Boden
                        .frmKij.Top = .cboStossstellenGrundlage.Top + 38 + .frmStossWandDeckeBoden.Height
                        .frmStossstelle.Height = .frmKij.Top + .frmKij.Height
                    Else 'Wände ohne Versatz
                        .frmKij.Top = .cboStossstellenGrundlage.Top + 60 + .frmStossWandDeckeBoden.Height
                        .frmStossstelle.Height = .frmKij.Top + .frmKij.Height
                    End If
                    .frmKij.Visible = True
                Else
                    .frmKij.Visible = False
                End If
                
                
                TopNeu = TopNeu + .frmStossstelle.Height + 10       'Neue Oberkannte des nächsten Rahmens
            
            
            ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
            '''' Stoßstellen für flankierende Leichtbauwände mit Versatz  ''''''''''''''''''''''''''''''''''''''''''''
            ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
            ElseIf bLeichtbauFlanke = True And .chkOhneVersatz = False And .cboFlankentyp <> "" And _
                   (intFlankenNr = 1 Or intFlankenNr = 2) Then
                   
                .frmStossstelle.Visible = True                      'Rahmen Stoßstelle anzeigen
                .frmStossstelle.Top = TopNeu                        'Position
                .txtmstrichFlankenbt = "-"
                .cboStossstellenGrundlage = "DIN 4109-2"
                .frmStossWandDeckeBoden.Visible = False
                .frmStossWandDeckeBodenGetrennt.Visible = False
                .frmStossWandWand.Visible = False
                .frmStossWandWandGetrennt.Visible = False
                .frmKij.Visible = False                             'Stoßstelldämm-Maße für Massivholzflanken ausblenden


                'Versatzauswahl einblenden
                If clsWand(1).Raumanordnung = MIT_VERSATZ And intFlankenNr = 1 And .chkOhneVersatz = False Then
                    .frmStossVersatzLinks.Visible = True
                    .frmStossVersatzLinks.Top = TopNeu + 20
                    .frmStossstelle.Height = .frmStossVersatzLinks.Top + .frmStossVersatzLinks.Height + 20
                ElseIf clsWand(1).Raumanordnung = MIT_VERSATZ And intFlankenNr = 2 And .chkOhneVersatz = False Then
                    .frmStossVersatzRechts.Visible = True
                    .frmStossVersatzRechts.Top = TopNeu + 20
                    .frmStossstelle.Height = .frmStossVersatzRechts.Top + .frmStossVersatzRechts.Height + 20
                End If
                
                
                'Stoßstellendämm-Maße einblenden
                If clsFlanke(intFlankenNr).Stossversatz <> "" Then
                    .frmKijminVersatz.Visible = True
                    .frmKijminVersatz.Top = TopNeu + 35 + .frmStossVersatzLinks.Height
                    If .txtKijminVersatz <> "" Then
                        .frmKij.Visible = True
                        .frmKij.Top = .frmKijminVersatz.Top + 20 + .frmKijminVersatz.Height
                        .frmStossstelle.Height = .frmKij.Top + .frmKij.Height
                    Else
                        .frmKij.Visible = False
                        .frmStossstelle.Height = .frmKijminVersatz.Top + .frmKijminVersatz.Height
                    End If
                Else
                    .frmKijminVersatz.Visible = False
                    .frmKij.Visible = False
                
                End If
                
               

                TopNeu = TopNeu + .frmStossstelle.Height + 30       'Neue Oberkannte des nächsten Rahmens
                
            ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
            ''''    Stoßstellen für diagonal angeordnete Räume                                    ''''''''''''''''''''
            ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
            ElseIf (clsWand(1).Raumanordnung = DIAGONAL And intFlankenNr = 2) And _
                   (.txtDnfwFlanke <> "" Or .txtRwFlanke <> "") Then
                   
                .frmStossstelleDiagonal.Visible = True
                .frmStossstelleDiagonal.Top = TopNeu
                .frmStossstelle.Visible = False
                
                If .cboWandtyp = MHW And .cboFlankentyp = MHW Then
                    .cmdDiagonalTWdurchlaufend.Picture = LoadPicture("")
                    .cmdDiagonalTWdurchlaufend.Picture = .Controls("imgDiagonal_FL1MHdurch_FL2MHgetr").Picture
                    .cmdDiagonalFLdurchlaufend.Picture = LoadPicture("")
                    .cmdDiagonalFLdurchlaufend.Picture = .Controls("imgDiagonal_FL1MHgetr_FL2MHdurch").Picture
                    .frmFlankengeometrie.Visible = False
                    .frmKijDIagonal.Top = .frmFlankengeometrie.Top
                   
                ElseIf .cboWandtyp = MHW And .cboFlankentyp <> MHW Then
                    .cmdDiagonalTWdurchlaufend.Picture = LoadPicture("")
                    .cmdDiagonalTWdurchlaufend.Picture = .Controls("imgDiagonal_FL1MHdurch_FL2LBgetr").Picture
                    .cmdDiagonalFLdurchlaufend.Picture = LoadPicture("")
                    .cmdDiagonalFLdurchlaufend.Picture = .Controls("imgDiagonal_FL1MHgetr_FL2LBdurch").Picture
                    .frmFlankengeometrie.Visible = True
                    .frmKijDIagonal.Top = .frmFlankengeometrie.Top + .frmFlankengeometrie.Height + 10
                
                ElseIf .cboWandtyp <> MHW And .cboFlankentyp = MHW Then
                    .cmdDiagonalTWdurchlaufend.Picture = LoadPicture("")
                    .cmdDiagonalTWdurchlaufend.Picture = .Controls("imgDiagonal_FL1LBdurch_FL2MHgetr").Picture
                    .cmdDiagonalFLdurchlaufend.Picture = LoadPicture("")
                    .cmdDiagonalFLdurchlaufend.Picture = .Controls("imgDiagonal_FL1LBgetr_FL2MHdurch").Picture
                    .frmFlankengeometrie.Visible = True
                    .frmKijDIagonal.Top = .frmFlankengeometrie.Top + .frmFlankengeometrie.Height + 10

                ElseIf .cboWandtyp <> MHW And .cboFlankentyp <> MHW Then
                    .frmStossstelleDiagonal.Visible = False

                End If
                
                .frmStossstelleDiagonal.Height = .frmKijDIagonal.Top + .frmKijDIagonal.Height + 20
                If .frmStossstelleDiagonal.Visible = True Then
                    TopNeu = TopNeu + .frmStossstelleDiagonal.Height + 20       'Neue Oberkannte des nächsten Rahmens
                End If
                
            '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
            '''''   Dialograhmen für sonstige Leichtbauflanken nicht anzeigen                      ''''''''''''''''''''
            '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
            Else
                .frmStossstelle.Visible = False                     'Rahmen nicht sichtbar
                .frmStossstelleDiagonal.Visible = False
            End If
    
    
            ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
            '''' Dialograhmen für Vorsatzschalen anzeigen ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
            ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
            If (bMassivholzFlanke = True Or bMassivFlanke = True) And (.txtKFf <> "" Or .txtKijmin <> "" Or .txtKFf1 <> "") Then
                .frmVS_Flanke.Visible = True                      'Rahmen anzeigen
                .frmVS_Flanke.Top = TopNeu                        'Position
                TopNeu = TopNeu + .frmVS_Flanke.Height + 10       'Neue Oberkannte des nächsten Rahmens
            Else
                .frmVS_Flanke.Visible = False                     'Rahmen nicht sichtbar
            End If
            
           
            ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
            '''' Button zur Übernahme der Daten in das Klassenobjekt Flankenbauteil anzeigen ''''''''''''''''''''''''''
            ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
            If .frmVS_Flanke.Visible = True Or IsNumeric(.txtDnfwFlanke) Or .txtKijminVersatz <> "" Or .txtKFf1 <> "" Then
                .cmdDatenuebernehmen.Top = TopNeu
                .cmdDatenuebernehmen.Visible = True
                TopNeu = TopNeu + .cmdDatenuebernehmen.Height
            Else
                .cmdDatenuebernehmen.Visible = False
            End If
    
        End If
        
        'Aktuelle Größe des Dialograhmens festlegen
        .frmFlankenbauteil.Height = TopNeu + 20

    End With

End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Flankeneingabe: Vorbelegte Felder für Neustart zurücksetezen bzw. aus clsFlanke einlesen     ''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Sub frmFlankeHolzbau_restart()
    With frmVBAcousticTrennwand
        Dim tempKijNorm As String
        
        'Alle ggf. noch sichtbaren Rahmen des Flankendialogs schließen
        .frmFlankenbauteil.Visible = False          'Bereits offener Flankendialog schließen
        .frmValidierung.Visible = False             'ggf. geöffnete Validierung schließen
        .frmVS_Flanke.Visible = False
        .frmStossstelle.Visible = False
        .frmRiw_Grundbauteil.Visible = False
        .frmBauweiseMassivwand.Visible = False
        .frmDnfwFlanke.Visible = False
        
        'Raumgeometrie übernehmen
        .txtRaumbreite_Holz = clsWand(1).Raumbreite
        .txtRaumhoehe_Holz = clsWand(1).Raumhoehe
        .txtRaumhoehe0m2 = clsWand(1).Raumhoehe
        
        'Bereits vorhandene Daten für die Flanke in den Flankendialog eintragen
        .cboFlankentyp = clsFlanke(intFlankenNr).FlankentypSR
        .cboMaterial = clsFlanke(intFlankenNr).WandmaterialSR
        .txtmstrichFlanke = IIf(clsFlanke(intFlankenNr).WandmasseSR > 0, clsFlanke(intFlankenNr).WandmasseSR, "")
        .txtmstrichFlankenbt = IIf(clsFlanke(intFlankenNr).WandmasseSR > 0, clsFlanke(intFlankenNr).WandmasseSR, "")
        .txtRwFlanke = IIf(clsFlanke(intFlankenNr).RwSR > 0, clsFlanke(intFlankenNr).RwSR, "")
        .txtDnfwFlanke = IIf(clsFlanke(intFlankenNr).DnfwSR > 0, clsFlanke(intFlankenNr).DnfwSR, "")
        .txtDRwSR_Flanke = IIf(clsFlanke(intFlankenNr).DRwSR > 0, clsFlanke(intFlankenNr).DRwSR, "")
        .txtDRwER_Flanke = IIf(clsFlanke(intFlankenNr).DRwER > 0, clsFlanke(intFlankenNr).DRwER, "")
        .txtlf = clsFlanke(intFlankenNr).lfSR
        
        
        'Bereits vorhandene Daten für die Stoßstelle in den Flankendialog eintragen
        tempKijNorm = clsFlanke(intFlankenNr).KijNorm   'ggf vorhandene Norm zwischenspeichern
        .cboStossstellenGrundlage.Text = ""             'Textfeld zurücksetzen
        Call frmFlankenbauteil_Holz_Initialize(intFlankenNr)
        .cboStossstellenGrundlage.Text = tempKijNorm    'Norm aus temporärem Zwischenspeicher neu eingeben
        
        'Stoßstellenversatz und Symmetrie der Flanke übernehmen
        If (clsFlanke(intFlankenNr).Stossversatz = "") Then
            .chkOhneVersatz = True
            .chkSymmetrie.Value = True
        Else
            .chkOhneVersatz = False
            .chkSymmetrie.Value = False 'Bei Versatz keine Symmetrie möglich
            .txtKijminVersatz = ""
            .txtlVersatz = 0: .txtlVersatz = clsFlanke(intFlankenNr).lVersatz
            .txtKFd = IIf(clsFlanke(intFlankenNr).KFd = -1000, "nv", clsFlanke(intFlankenNr).KFd)
            .txtKDf = IIf(clsFlanke(intFlankenNr).KDf = -1000, "nv", clsFlanke(intFlankenNr).KDf)

        End If
        
        'Geomerie der Flanken übernehmen
        .txtlf = IIf(clsFlanke(intFlankenNr).lfSR > 0, clsFlanke(intFlankenNr).lfSR, "")
        .txtS1_Flanke = IIf(clsFlanke(intFlankenNr).FlaecheSR > 0, clsFlanke(intFlankenNr).FlaecheSR, "")
        .txtS2_Flanke = IIf(clsFlanke(intFlankenNr).FlaecheER > 0, clsFlanke(intFlankenNr).FlaecheER, "")
    
    
        'Stoßstellendämm-Maße einlesen
        If clsFlanke(intFlankenNr).FlankentypSR = MW Or _
           clsFlanke(intFlankenNr).FlankentypSR = SBD Or _
           clsFlanke(intFlankenNr).FlankentypSR = SB_FlACHD Then
           
            .txtKijmin = clsFlanke(intFlankenNr).KFf
           
        ElseIf clsFlanke(intFlankenNr).FlankentypSR = MHD Or _
               clsFlanke(intFlankenNr).FlankentypSR = MHW Or _
               clsFlanke(intFlankenNr).FlankentypSR = MH_FLACHD And _
               clsWand(1).Raumanordnung <> DIAGONAL Then
               
            .txtKFf = clsFlanke(intFlankenNr).KFf
            
            If clsWand(1).Wandtyp = MHW Then
                .txtKFd = clsFlanke(intFlankenNr).KFd
                .txtKDf = clsFlanke(intFlankenNr).KDf
            End If
            
            'Stoßstelle ggf. in Kombination mit geänderter Trennwand neu berechnen
            Call Stossstellenberechnung(clsFlanke(intFlankenNr).Stossstelle)
            
        ElseIf clsWand(1).Raumanordnung = DIAGONAL And intFlankenNr = 2 _
               And clsFlanke(intFlankenNr).FlankentypSR = MHW Then
               
            .txtKFf1 = clsFlanke(1).KFf: .txtKFf2 = clsFlanke(1).KFd
            .txtKFf3 = clsFlanke(2).KFf: .txtKFf4 = clsFlanke(2).KFd
            
        End If
        
        If .WebBrowserPDF.Visible = True Then Call pdfclose        'ggf. geöffnetes Ergebnis-PDF schließen

        bStatusRwBerechnung = False
        
    End With
End Sub

Private Sub Flankendaten_zuruecksetzen()
    With frmVBAcousticTrennwand
      .txtRwFlanke = "": .txtDnfwFlanke = "": .txtDRwSR_Flanke = "": .txtDRwER_Flanke = ""
      .txtmstrichFlanke = "": .txtmstrichFlankenbt = "": .txtS1_Flanke = "": .txtS2_Flanke = ""
      .cboStossstellenGrundlage = "": .txtKFf = "": .txtKFd = "": .txtKDf = "": .txtKijmin = ""
      .txtKFf1 = "": .txtKFf2 = "": .txtKFf3 = "": .txtKFf4 = ""
      .txtlVersatz = "": .txtKijminVersatz = "": .chkSymmetrie = True: .chkOhneVersatz = True
      bStatusRwBerechnung = False
    End With
End Sub



''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''                                                                                            ''''''''''''''''
''''''''''''                     FLANKENBAUTEIL SENDERAUM                                               ''''''''''''''''
''''''''''''                                                                                            ''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''                     Auswahl des Flankentyps                                                ''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cboFlankentyp_Change()
    With frmVBAcousticTrennwand
      .cboFlankentyp.BackColor = &H8000000F                'ggf. rote Hintrgrundfarbe zurücksetzen
      
      'bei Flankentypänderung Flankendaten zurücksetzen
      Call Flankendaten_zuruecksetzen: cboMaterial.Clear: .cboMaterial = ""
      bMassivFlanke = False: bMassivholzFlanke = False: bLeichtbauFlanke = False
      .cboStossstellenGrundlage.Clear
      
      'Flankentyp in Gruppen (MassivFlanke, Massivholzflanke, Leichtbauflanke) zusammenfassen
      If cboFlankentyp = MW Or cboFlankentyp = SBD Or cboFlankentyp = SB_FlACHD Then
        bMassivFlanke = True: bMassivholzFlanke = False: bLeichtbauFlanke = False
        .chkOhneVersatz = True 'Massivflanken immer ohne Versatz
      ElseIf cboFlankentyp = MHW Or cboFlankentyp = MHD Or cboFlankentyp = MH_FLACHD Then
        bMassivholzFlanke = True: bMassivFlanke = False: bLeichtbauFlanke = False
      ElseIf cboFlankentyp = HSTW Or cboFlankentyp = MSTW Or cboFlankentyp = HBD Or _
             cboFlankentyp = HB_FLACHD Or cboFlankentyp = SP_STEILD Then
        bLeichtbauFlanke = True: bMassivholzFlanke = False: bMassivFlanke = False
      End If
      
      .chkSymmetrie = True                                          'Flanke symmetrisch beiderseits der Trennwand
      clsFlanke(intFlankenNr).FlankentypSR = cboFlankentyp.Text     'Wandtyp in Klasse abspeichern
      Call Warnhinweis                                              'Warnhinweis fals keine exakte Normberechnung möglich
      Call frmFlankenbauteil_Holz_Initialize(intFlankenNr)          'Anzeige der GUI aktualisieren
      
      
    End With
End Sub
Private Sub chkSymmetrie_Click() 'Flankentyp: Flanke beidseits des Trennbauteils symetrisch?
    With frmVBAcousticTrennwand
            If .chkSymmetrie.Value = False And .chkOhneVersatz = True Then
                Call frmWarningMessage.WarningMessage("Berechnung nicht möglich", "Warning")
                .chkSymmetrie.Value = True
            End If
    End With
End Sub
Private Sub cboMaterial_Change()  'Auswahl des Wandmaterials für Massivwände
    With frmVBAcousticTrennwand
      .cboMaterial.BackColor = &H8000000F                'ggf. rote Hintrgrundfarbe zurücksetzen
      clsFlanke(intFlankenNr).WandmaterialSR = cboMaterial.Text              'Material in Klasse abspeichern
      Call Flankendaten_zuruecksetzen
      Call frmFlankenbauteil_Holz_Initialize(intFlankenNr)
    End With
End Sub
Private Sub Warnhinweis()        ' Warnhinweis für unpassende Kombinationen von Trennbauteil und Flanke
    With frmVBAcousticTrennwand
        If (clsWand(1).Wandtyp = HSTW And .cboFlankentyp = MHW) Or _
           (clsWand(1).Wandtyp = MSTW And .cboFlankentyp = MHW) Then
            Call frmWarningMessage.WarningMessage("Berechnung kann nur näherungsweise stattfinden", "Warning")
        End If
    End With
End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''               Direkter Eintrag von Rw_Grundbauteil oder Dn,f,w der Flanke            ''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub txtRwFlanke_Change() 'Ri,w
    With frmVBAcousticTrennwand
        .txtRwFlanke.BackColor = &H8000000F                'ggf. rote Hintrgrundfarbe zurücksetzen
        Call frmFlankenbauteil_Holz_Initialize(intFlankenNr)
    End With
End Sub
Private Sub txtDnfwFlanke_Change() 'Dn,f,w
    With frmVBAcousticTrennwand
        .txtDnfwFlanke.BackColor = &H8000000F                'ggf. rote Hintrgrundfarbe zurücksetzen
        clsFlanke(intFlankenNr).Quelle = ""                  'Quellenangabe zurücksetzen
        Call frmFlankenbauteil_Holz_Initialize(intFlankenNr)
    End With
End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''                      Bauteilkataloge: Auswahl der Flankenbauteile                    ''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cmdDIN4109_Flanke_click()    'DIN 4109-33
    'Sonderfall: flankierende Holzbalkendecken als Boden werden direkt mit Dnfw = 67 dB belegt
    If frmVBAcousticTrennwand.cboFlankentyp = HBD And intFlankenNr = 3 Then
        frmVBAcousticTrennwand.txtDnfwFlanke = 67
        clsFlanke(intFlankenNr).Quelle = "Quelle: DIN 4109-33:2016-07, Abschnitt 5.3.1.1"
        Exit Sub
    End If
    
    'Standardroutine:
    Application.ScreenUpdating = False                                                  ' im Hintergrund ohne Anzeige
    Application.Workbooks(VBAcoustic).Activate
    If frmVBAcousticTrennwand.WebBrowserPDF.Visible = True Then Call pdfclose        'ggf. geöffnetes Ergebnis-PDF schließen
    BTK_DIN4109_33 = openfile("Bauteilkatalog_DIN4109_33.xlsm")                         'Datei zum Bauteilkatalog DIN4109-33 öffnen
    Application.Workbooks(VBAcoustic).Activate
    
    'Bauteilkatalog "Flanken" darstellen und Bauteil auswählen/einlesen
    Application.Run "Bauteilkatalog_DIN4109_33.xlsm!DIN4109_33_Flanken", _
    frmVBAcousticTrennwand.cboFlankentyp, "Anwendungstyp", _
    frmVBAcousticTrennwand.Left, VBAcoustic
    
    Application.ScreenUpdating = True
    Application.Workbooks("Bauteilkatalog_DIN4109_33.xlsm").Close                       'Datei schließen
    Application.Workbooks(VBAcoustic).Activate                                           'VBAcoustic aktiv setzen
End Sub
Private Sub cmdVaBDat_flanke_click()     'VaBDat

    Call frmWarningMessage.WarningMessage("Noch nicht Verfügbar", "UnderConstruction")

End Sub
Private Sub cmdDataholz_flanke_click()   'Dataholz
    With frmVBAcousticTrennwand
        If .frmFlankenbauteiltyp.Caption = "Flankenbauteil Nr. 1:" Or _
            .frmFlankenbauteiltyp.Caption = "Flankenbauteil Nr. 2:" Then
            Set wshshell = CreateObject("WScript.Shell")
            wshshell.Run "https://www.dataholz.eu/bauteile/aussenwand.htm"
            wshshell.Run "https://www.dataholz.eu/bauteile/innenwand.htm"
        ElseIf .frmFlankenbauteiltyp.Caption = "Flankenbauteil Nr. 3:" Then
            Set wshshell = CreateObject("WScript.Shell")
            wshshell.Run "https://www.dataholz.eu/bauteile/geschossdecke.htm"
            wshshell.Run "https://www.dataholz.eu/bauteile/decke-gegen-unbeheizt.htm"
        ElseIf .frmFlankenbauteiltyp.Caption = "Flankenbauteil Nr. 4:" Then
            Set wshshell = CreateObject("WScript.Shell")
            wshshell.Run "https://www.dataholz.eu/bauteile/geschossdecke.htm"
            wshshell.Run "https://www.dataholz.eu/bauteile/decke-gegen-unbeheizt.htm"
            wshshell.Run "https://www.dataholz.eu/bauteile/daecher.htm"
            wshshell.Run "https://www.dataholz.eu/bauteile/flachdach-flachgeneigtes-dach.htm"
        End If
    End With
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''     Direkte Berechnung: Ri,w Grundbauteil aus flächenbezogener Masse berechnen       ''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cmdRwBerechnen_Flanke_Click()
    bStatusRwBerechnung = True
    Call frmFlankenbauteil_Holz_Initialize(intFlankenNr)
End Sub
Private Sub txtmstrichFlanke_Change()         'flächenbezogene Masse der Flanke eingeben
    If frmVBAcousticTrennwand.txtmstrichFlanke > 30 And frmVBAcousticTrennwand.txtmstrichFlanke <> "" Then
        With frmVBAcousticTrennwand
            .txtmstrichFlanke.BackColor = &H8000000F                'ggf. rote Hintrgrundfarbe zurücksetzen
            If bMassivholzFlanke = True Then
                If .cboMaterial = MHE And CDbl(.txtmstrichFlanke) <= 100 Then     'Massivholz- Deckenelement oder Flachdachelement
                    .txtRwFlanke = Round(Rw_HB(.txtmstrichFlanke), 1)
                    
                ElseIf .cboMaterial = MHE_SPLITT And .txtmstrichFlanke >= 140 And .txtmstrichFlanke <= 250 Then     'Schüttung auf Massivholz-Deckenelement oder Flachdachelement
                    .txtRwFlanke = Round(Rw_beschwert(.txtmstrichFlanke), 1)
               
                ElseIf .cboMaterial = MHE_HBV Then     'Deckenelement oder Flachdachelement als Holz-Beton-Verbund-Element
                    If (.txtmstrichFlanke >= 180 And .txtmstrichFlanke <= 500) Then .txtRwFlanke = Round(RwBauteil("Massivbau", "Beton", .txtmstrichFlanke, "Flanke"), 1)
        
                ElseIf .cboFlankentyp = MHW And .txtmstrichFlanke >= 35 And .txtmstrichFlanke <= 160 Then  'Massivholz-Wandelement"
                    .txtRwFlanke = Round(Rw_HB(.txtmstrichFlanke), 1)
                    
                ElseIf .txtmstrichFlanke <= 35 Or .txtmstrichFlanke = "" Then
                'auf zweite Ziffer warten
                
                Else
                    .txtRwFlanke = ""
                    Call frmWarningMessage.WarningMessage("Berechnung für diese Masse nicht möglich", "Warning")
                End If
                
            ElseIf bMassivFlanke = True Then
                If .txtmstrichFlanke >= 65 And .txtmstrichFlanke <= 720 Then
                    If .cboFlankentyp = MW Then
                        .txtRwFlanke = Round(RwBauteil("Massivbau", .cboMaterial, .txtmstrichFlanke, "Flanke"), 1)
                    Else
                        .txtRwFlanke = Round(RwBauteil("Massivbau", "Beton", .txtmstrichFlanke, "Flanke"), 1)
                    End If
                    
                ElseIf .txtmstrichFlanke <= 72 Or .txtmstrichFlanke = "" Then
                'auf weitere Ziffern warten

                Else
                    .txtRwFlanke = ""
                    Call frmWarningMessage.WarningMessage("Berechnung für diese Masse nicht möglich", "Warning")
                End If
                
            End If
            bFlanke = True
            frmf0.txtmGW = .txtmstrichFlanke         'Übergeben von m' an VS-Eingabe
            .txtmstrichFlankenbt = .txtmstrichFlanke    'Übergeben von m' an Stoßstellenberechnung
        End With
    End If
End Sub




''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''                                                                                            ''''''''''''''''
''''''''''''                   STOSSSTELLE                                                              ''''''''''''''''
''''''''''''                                                                                            ''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''                  Gundlage/Norm für der Stoßstellenberechnung festlegen                     ''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cboStossstellenGrundlage_change()
    With frmVBAcousticTrennwand
        .frmWarnhinweis.Visible = False
        .cboStossstellenGrundlage.BackColor = &H8000000F                'ggf. rote Hintrgrundfarbe zurücksetzen
        If bMassivFlanke = True Then
            .frmKijmin.Visible = True: .frmKij.Visible = False
            .frmStossWandDeckeBoden.Visible = False
            .frmStossWandWand.Visible = False
            .frmStossstelle.Height = intAppHeight / 792 * 265
            
        ElseIf cboStossstellenGrundlage = DIN_EN_ISO12354 Then
            .txtKFf = "": .txtKFd = "": .txtKDf = ""
            .frmKij.Visible = True: .frmKijmin.Visible = False
            .cmdFlbtUnterbrochen.Visible = True: .lblunterbrochen.Visible = True
            .cmdFlbtdurchlaufend.Visible = False: .Lbldurchlaufend.Visible = False
            .cmdFlbtGetrennt.Visible = False: .lblgetrennt.Visible = False
            .cmdDeckedurchlaufend.Visible = False: .lblDeckedurchlaufend.Visible = False
            .cmdDeckegetrennt.Visible = False: .lblDeckegetrennt.Visible = False
            If .cboFlankentyp = MH_FLACHD Then
                .cmdDeckedurchlaufendEN.Visible = False
                .lblDeckedurchlaufendEN.Visible = False
                Call frmWarningMessage.WarningMessage("Keine Stoßstellendaten vorhanden", "Warning")
            Else
                .cmdDeckedurchlaufendEN.Visible = True
                .lblDeckedurchlaufendEN.Visible = True
            End If
            .frmStossstelle.Height = intAppHeight / 792 * 375
            
        Else
            .txtKFf = "": .txtKFd = "": .txtKDf = ""
            .frmKij.Visible = True: .frmKijmin.Visible = False
            .cmdFlbtUnterbrochen.Visible = True: .lblunterbrochen.Visible = True
            .cmdFlbtdurchlaufend.Visible = True: .Lbldurchlaufend.Visible = True
            .cmdFlbtGetrennt.Visible = True: .lblgetrennt.Visible = True
            .cmdDeckedurchlaufend.Visible = True: .lblDeckedurchlaufend.Visible = True
            .cmdDeckegetrennt.Visible = True: .lblDeckegetrennt.Visible = True
            .cmdDeckedurchlaufendEN.Visible = False: .lblDeckedurchlaufendEN.Visible = False
            .frmStossstelle.Height = intAppHeight / 792 * 375
        End If
    End With
    Call frmFlankenbauteil_Holz_Initialize(intFlankenNr)
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''                  Stoßstelle ohne Versatz bei Raumversatz der anderen Flankenwand           ''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub chkOhneVersatz_Click()
    If (intFlankenNr = 3 Or intFlankenNr = 4) Then chkOhneVersatz = True: Exit Sub 'Versatz nur bei Wänden vorgesehen
    If (frmVBAcousticTrennwand.cboFlankentyp = MW) Then chkOhneVersatz = True: Exit Sub 'Versatz nicht für Massivwände vorgesehen
    If chkOhneVersatz = True Then
        clsFlanke(intFlankenNr).Stossversatz = ""   'Versatztyp der Flanke zurücksetzen
        frmVBAcousticTrennwand.chkSymmetrie = True
        frmVBAcousticTrennwand.txtDnfwFlanke = ""    'Flankendämm-Maß zurücksetzen
    Else
        frmVBAcousticTrennwand.chkSymmetrie = False  'Bei Versatz ist keine Symmetrie vorhanden
        frmVBAcousticTrennwand.txtDnfwFlanke = "nv" 'Flankendämm-Maß bei versetzten Flanken nicht sinnvoll
    End If
    
    'Stoßstellendämm-Maße zurücksetzen
    frmVBAcousticTrennwand.txtKFf = ""
    frmVBAcousticTrennwand.txtKFd = ""
    frmVBAcousticTrennwand.txtKDf = ""
    frmVBAcousticTrennwand.txtKijmin = ""
    frmVBAcousticTrennwand.txtKijminVersatz = ""
    frmVBAcousticTrennwand.txtlVersatz = ""

    
    Call frmFlankenbauteil_Holz_Initialize(intFlankenNr)
End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''                 Kantenlänge Flanke/Trennbautei oder m' ändern                            ''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub txtlf_Change()                        'Kantenlänge ändern
    frmVBAcousticTrennwand.txtlf.BackColor = &H8000000F                'ggf. rote Hintrgrundfarbe zurücksetzen
End Sub
Private Sub txtmstrichFlankenbt_Change()          'flächenbezogene Masse der Flanke für Kij -Berechnung
    With frmVBAcousticTrennwand
        txtmstrichFlankenbt.BackColor = &H8000000F                'ggf. rote Hintrgrundfarbe zurücksetzen
        frmf0.txtmGW = .txtmstrichFlankenbt       'Übergeben von m' an VS-Eingabe
    End With
End Sub
Private Sub txtmstrichTrennbt_Change()            'flächenbezogene Masse des Trennbauteils für Kij -Berechnung
    With frmVBAcousticTrennwand
        txtmstrichTrennbt.BackColor = &H8000000F                'ggf. rote Hintrgrundfarbe zurücksetzen
    End With
End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''               Auswahl der Stoßstellenausführung                                          ''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cmdFlbtdurchlaufend_Click()  'Stoß Wand/Wand: Flankierendes Bauteil durchlaufend
        strStossstelle = "T-Stoss, flankierende Wand durchlaufend"
        Call Stossstellenberechnung(strStossstelle)
End Sub
Private Sub cmdFlbtGetrennt_Click()      'Stoß Wand/Wand: Flankierendes Bauteil getrennt
        strStossstelle = "T-Stoss, flankierende Wand getrennt"
        Call Stossstellenberechnung(strStossstelle)
End Sub
Private Sub cmdFlbtUnterbrochen_Click()  'Stoß Wand/Wand: Flankierendes Bauteil unterbrochen
        strStossstelle = "T-Stoss, flankierende Wand unterbrochen"
        Call Stossstellenberechnung(strStossstelle)
End Sub
Private Sub cmdFlbtVollGetrennt_a_Click() 'Stoß fl.Wand/Zweischalige TW: Doppel-L-Stoß; fl. Wand vollständig getrennt
        strStossstelle = "Doppel-L-Stoss, flankierende Wand vollständig getrennt"
        Call Stossstellenberechnung(strStossstelle)
End Sub
Private Sub cmdFlbtVollGetrennt_b_Click() 'Stoß fl.Wand/Zweischalige TW: Doppel-L-Stoß; fl. Wand vollständig getrennt, TW bis nach außen laufend
        strStossstelle = "Doppel-L-Stoss, flankierende Wand vollständig getrennt und unterbrochen"
        Call Stossstellenberechnung(strStossstelle)
End Sub
Private Sub cmdFlbtVollGetrennt_c_Click() 'Stoß fl.Wand/Zweischalige TW: Doppel-T-Stoß; fl. Wand vollständig getrennt; TW weiterlaufend
        strStossstelle = "Doppel-T-Stoss, flankierende Wand vollständig getrennt und unterbrochen"
        Call Stossstellenberechnung(strStossstelle)
End Sub

Private Sub cmdFlbtVolldurchlaufend_Click() 'Stoß Wand/Wand: Flanke durch zweischalige Trennwand NICHT getrennt
        strStossstelle = "T-Stoss, flankierende Wand durchlaufend"
        Call Stossstellenberechnung(strStossstelle)
End Sub

Private Sub cmdDeckedurchlaufend_Click()
        strStossstelle = "T-Stoss, flankierende Decke durchlaufend"
        Call Stossstellenberechnung(strStossstelle)
End Sub
Private Sub cmdDeckegetrennt_Click()
        strStossstelle = "T-Stoss, flankierende Decke getrennt"
        Call Stossstellenberechnung(strStossstelle)
End Sub
Private Sub cmdDeckedurchlaufendEN_Click()
        strStossstelle = "X-Stoss, flankierende Decke durchlaufend"
        Call Stossstellenberechnung(strStossstelle)
End Sub
Private Sub cmdDeckeVolldurchlaufend_Click() 'Stoß Wand/Decke: Flankierende Decke über zweischaliger Trennwand durchlaufend
        strStossstelle = "T-Stoss, flankierende Decke durchlaufend"
        Call Stossstellenberechnung(strStossstelle)
End Sub
Private Sub cmdDeckeVollgetrennt_Click() 'Doppel-L-Stoß Wand/Decke: Flankierende Decke auf zweischaliger Trennwand vollständig getrennt
        strStossstelle = "Doppel-L-Stoss, flankierende Decke vollständig getrennt"
        Call Stossstellenberechnung(strStossstelle)
End Sub
Private Sub cmdDeckeVollgetrennt_b_Click() 'Doppel-T-Stoß Wand/Decke: Flankierende Decke auf zweischaliger Trennwand vollständig getrennt
        strStossstelle = "Doppel-T-Stoss, flankierende Decke vollständig getrennt"
        Call Stossstellenberechnung(strStossstelle)
End Sub


Private Sub cmdVersatzLinksAussen_Click()
        strStossstelle = "T-Stoss, flankierende Wand durchlaufend"
        clsFlanke(intFlankenNr).Stossversatz = WAND_LINKS_AUSSEN
        If bLeichtbauFlanke = False Then
            Call Stossstellenberechnung(strStossstelle)
        Else
            Call frmFlankenbauteil_Holz_Initialize(intFlankenNr)
        End If
        
        'Für zweischalige TW Stoßstellentyp korrigieren
        If clsWand(1).Anwendungstyp = WTW_2 Then clsFlanke(intFlankenNr).Stossstelle = "Doppel-L-Stoss, flankierende Wand vollständig getrennt"
End Sub
Private Sub cmdVersatzLinksInnen_Click()
        strStossstelle = "T-Stoss, flankierende Wand durchlaufend"
        clsFlanke(intFlankenNr).Stossversatz = WAND_LINKS_INNEN
        If bLeichtbauFlanke = False Then
            Call Stossstellenberechnung(strStossstelle)
        Else
            Call frmFlankenbauteil_Holz_Initialize(intFlankenNr)
        End If
        
        'Für zweischalige TW Stoßstellentyp korrigieren
        If clsWand(1).Anwendungstyp = WTW_2 Then clsFlanke(intFlankenNr).Stossstelle = "Doppel-L-Stoss, flankierende Wand vollständig getrennt"
End Sub
Private Sub cmdVersatzRechtsAussen_Click()
        strStossstelle = "T-Stoss, flankierende Wand durchlaufend"
        clsFlanke(intFlankenNr).Stossversatz = WAND_RECHTS_AUSSEN
        If bLeichtbauFlanke = False Then
            Call Stossstellenberechnung(strStossstelle)
        Else
            Call frmFlankenbauteil_Holz_Initialize(intFlankenNr)
        End If
        
        'Für zweischalige TW Stoßstellentyp korrigieren
        If clsWand(1).Anwendungstyp = WTW_2 Then clsFlanke(intFlankenNr).Stossstelle = "Doppel-L-Stoss, flankierende Wand vollständig getrennt"

End Sub
Private Sub cmdVersatzRechtsInnen_Click()
        strStossstelle = "T-Stoss, flankierende Wand durchlaufend"
        clsFlanke(intFlankenNr).Stossversatz = WAND_RECHTS_INNEN
        If bLeichtbauFlanke = False Then
            Call Stossstellenberechnung(strStossstelle)
        Else
            Call frmFlankenbauteil_Holz_Initialize(intFlankenNr)
        End If
        
        'Für zweischalige TW Stoßstellentyp korrigieren
        If clsWand(1).Anwendungstyp = WTW_2 Then clsFlanke(intFlankenNr).Stossstelle = "Doppel-L-Stoss, flankierende Wand vollständig getrennt"

End Sub

Sub Stossstellenberechnung(strStossstelle As String) 'Stoßstellenberechnung anstoßen
    With frmVBAcousticTrennwand
        clsFlanke(intFlankenNr).Stossstelle = strStossstelle
        .frmWarnhinweis.Visible = False
        .txtKFf = Round(calc_Holzbau_single.Kij_HB(.cboStossstellenGrundlage, strStossstelle, "Ff", "horizontal", .txtmstrichFlankenbt, .txtmstrichTrennbt), 1)
        If (strStossstelle = "T-Stoss, flankierende Decke getrennt") Then
            If .txtKFf < 10 Then .txtKFf = 10
            If .txtmstrichTrennbt / .txtmstrichFlankenbt < 0.5 Then .frmWarnhinweis.Visible = True: .frmWarnhinweis.Top = .cmdDeckegetrennt.Top
        End If
        If clsWand(1).Wandtyp = MHW Then
            .txtKFd = Round(calc_Holzbau_single.Kij_HB(.cboStossstellenGrundlage, strStossstelle, "Fd", "horizontal", .txtmstrichFlankenbt, .txtmstrichTrennbt), 1)
            .txtKDf = Round(calc_Holzbau_single.Kij_HB(.cboStossstellenGrundlage, strStossstelle, "Df", "horizontal", .txtmstrichFlankenbt, .txtmstrichTrennbt), 1)
        Else
            .txtKFd = "-"
            .txtKDf = "-"
        End If
        'Umsortieren bei Versatz
        If (clsFlanke(intFlankenNr).Stossversatz = WAND_LINKS_AUSSEN) Then
            .txtKDf = .txtKFf: .txtKFf = .txtKFd
        ElseIf clsFlanke(intFlankenNr).Stossversatz = WAND_LINKS_INNEN Then
            .txtKFd = .txtKFf: .txtKFf = .txtKDf
        ElseIf clsFlanke(intFlankenNr).Stossversatz = WAND_RECHTS_AUSSEN Then
            .txtKDf = .txtKFf: .txtKFf = .txtKFd
        ElseIf clsFlanke(intFlankenNr).Stossversatz = WAND_RECHTS_INNEN Then
            .txtKFd = .txtKFf: .txtKFf = .txtKDf
        End If
        .cmdFlbtdurchlaufend.BackColor = &H80000005         'ggf. roten Hintergrund ändern
        .cmdFlbtUnterbrochen.BackColor = &H80000005         'ggf. roten Hintergrund ändern
        .cmdFlbtGetrennt.BackColor = &H80000005             'ggf. roten Hintergrund ändern
        frmFlankenbauteil_Holz_Initialize (intFlankenNr)
    End With
End Sub
Private Sub txtKFf_Change()
        frmVBAcousticTrennwand.txtKFf.BackColor = &H8000000F                'ggf. rote Hintrgrundfarbe zurücksetzen
End Sub
Private Sub txtKFd_Change()
        frmVBAcousticTrennwand.txtKFd.BackColor = &H8000000F                'ggf. rote Hintrgrundfarbe zurücksetzen
End Sub
Private Sub txtKDf_Change()
        frmVBAcousticTrennwand.txtKDf.BackColor = &H8000000F                'ggf. rote Hintrgrundfarbe zurücksetzen
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Kij,min Berechnung für Trennwand in Leichtbauweise und Massivflanke                              ''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub txtS1_Flanke_Change()
    With frmVBAcousticTrennwand
        .txtS1_Flanke.BackColor = &H8000000F                'ggf. rote Hintrgrundfarbe zurücksetzen
        If IsNumeric(.txtS1_Flanke) And .txtS1_Flanke > 0 And IsNumeric(.txtS2_Flanke) And .txtS2_Flanke > 0 Then
            .txtKijmin = Round(10 * Log10(.txtlf * (1 / .txtS1_Flanke + 1 / .txtS2_Flanke)), 1)
        End If
    End With
End Sub
Private Sub txtS2_Flanke_Change()
    With frmVBAcousticTrennwand
        .txtS2_Flanke.BackColor = &H8000000F                'ggf. rote Hintrgrundfarbe zurücksetzen
        If IsNumeric(.txtS1_Flanke) And .txtS1_Flanke > 0 And _
           IsNumeric(.txtS2_Flanke) And .txtS2_Flanke > 0 And IsNumeric(.txtlf) Then
           
            .txtKijmin = Round(10 * Log10(.txtlf * (1 / .txtS1_Flanke + 1 / .txtS2_Flanke)), 1)
            
        End If
    End With
End Sub
Private Sub txtKijmin_Change()
    With frmVBAcousticTrennwand
            .txtKijmin.BackColor = &H8000000F                'ggf. rote Hintrgrundfarbe zurücksetzen
            .txtKFf = IIf(IsNumeric(.txtKijmin), .txtKijmin, 0)
            .txtKFd = 0: .txtKDf = 0
            Call frmFlankenbauteil_Holz_Initialize(intFlankenNr)
    End With
End Sub
Private Sub txtlVersatz_Change()
    With frmVBAcousticTrennwand
        .txtlVersatz.BackColor = &H8000000F                'ggf. rote Hintrgrundfarbe zurücksetzen
        If .txtlVersatz <> "" And .txtlVersatz > 0 And clsWand(1).Flaeche > 0 Then
            .txtKijminVersatz = Round(10 * Log10(.txtlf * (1 / clsWand(1).Flaeche + 1 / (.txtlf * .txtlVersatz))), 1)
        End If
    End With
End Sub
Private Sub txtKijminVersatz_Change()
    With frmVBAcousticTrennwand
            .txtKijminVersatz.BackColor = &H8000000F                'ggf. rote Hintrgrundfarbe zurücksetzen
            .txtKFf = "": .txtKFd = "": .txtKDf = ""
            If clsFlanke(intFlankenNr).Stossversatz = WAND_LINKS_AUSSEN Then
                .txtKDf = .txtKijminVersatz
                .txtKFf = "nv"
                .txtKFd = "nv"
            ElseIf clsFlanke(intFlankenNr).Stossversatz = WAND_RECHTS_AUSSEN Then
                .txtKDf = .txtKijminVersatz
                .txtKFf = "nv"
                .txtKFd = "nv"
            ElseIf clsFlanke(intFlankenNr).Stossversatz = WAND_LINKS_INNEN Then
                .txtKFd = .txtKijminVersatz
                .txtKFf = "nv"
                .txtKDf = "nv"
            ElseIf clsFlanke(intFlankenNr).Stossversatz = WAND_RECHTS_INNEN Then
                .txtKFd = .txtKijminVersatz
                .txtKFf = "nv"
                .txtKDf = "nv"
            End If
            Call frmFlankenbauteil_Holz_Initialize(intFlankenNr)
    End With
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Kij Berechnung für DIAGONALE Raumanordnung                                                       ''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cmdDiagonalTWdurchlaufend_Click()
    clsFlanke(1).Stossstelle = X_STOSS_DURCHLAUFEND
    clsFlanke(2).Stossstelle = X_STOSS_UNTERBROCHEN
    With frmVBAcousticTrennwand
        If .cboWandtyp = MHW And .cboFlankentyp = MHW Then
            'durchlaufende Trennwand als Flanke 1
            strStossstelle = "T-Stoss, flankierende Wand durchlaufend" '!!!!!! X-Stoss ergänzen
            .txtKFf1 = Round(calc_Holzbau_single.Kij_HB(VIBROAKUSTIK, strStossstelle, "Ff", "horizontal", 0, 0), 1)
            .txtKFf2 = Round(calc_Holzbau_single.Kij_HB(VIBROAKUSTIK, strStossstelle, "Fd", "horizontal", 0#, 0), 1)
            'Flanke 2 unterbrochen
            strStossstelle = "T-Stoss, flankierende Wand unterbrochen"
            .txtKFf3 = Round(calc_Holzbau_single.Kij_HB(VIBROAKUSTIK, strStossstelle, "Ff", "horizontal", 0#, 0), 1)
            .txtKFf4 = Round(calc_Holzbau_single.Kij_HB(VIBROAKUSTIK, strStossstelle, "Fd", "horizontal", 0#, 0), 1)
            
        ElseIf .cboWandtyp = MHW And .cboFlankentyp <> MHW Then
            'durchlaufende Trennwand als Flanke 1
            If IsNumeric(.txtSi_Diagonal) And .txtSi_Diagonal > 0 And IsNumeric(.txtSj_Diagonal) And .txtSj_Diagonal > 0 Then
                .txtKFf1 = Round(10 * Log10(.txtlf * (1 / .txtSi_Diagonal + 1 / .txtSj_Diagonal)), 1)
                .txtKFf2 = "nv": .txtKFf3 = "nv": .txtKFf4 = "nv"
            Else
                .txtSi_Diagonal.BackColor = vbRed: .txtSj_Diagonal.BackColor = vbRed
            End If

        ElseIf .cboWandtyp <> MHW And .cboFlankentyp = MHW Then
            'durchlaufende Trennwand als Flanke 2
            If IsNumeric(.txtSi_Diagonal) And .txtSi_Diagonal > 0 And IsNumeric(.txtSj_Diagonal) And .txtSj_Diagonal > 0 Then
                strStossstelle = "T-Stoss, flankierende Wand unterbrochen"
                .txtKFf3 = Round(calc_Holzbau_single.Kij_HB(VIBROAKUSTIK, strStossstelle, "Ff", "horizontal", 0#, 0), 1)
                .txtKFf2 = "nv": .txtKFf1 = "nv": .txtKFf4 = "nv"
            Else
                .txtSi_Diagonal.BackColor = vbRed
            End If
        Else
            MsgBox ("Flankenkombination unbekannt")
        End If
        
        .cmdDiagonalFLdurchlaufend.BackStyle = fmBackStyleTransparent
        
        Call frmFlankenbauteil_Holz_Initialize(intFlankenNr)
    End With
End Sub
Private Sub cmdDiagonalFLdurchlaufend_Click()
    clsFlanke(2).Stossstelle = X_STOSS_DURCHLAUFEND
    clsFlanke(1).Stossstelle = X_STOSS_UNTERBROCHEN
    With frmVBAcousticTrennwand
        If .cboWandtyp = MHW And .cboFlankentyp = MHW Then
            'gestoßene Trennwand als Flanke 1
            strStossstelle = "T-Stoss, flankierende Wand unterbrochen"
            .txtKFf1 = Round(calc_Holzbau_single.Kij_HB(VIBROAKUSTIK, strStossstelle, "Ff", "horizontal", 0#, 0), 1)
            .txtKFf2 = Round(calc_Holzbau_single.Kij_HB(VIBROAKUSTIK, strStossstelle, "Fd", "horizontal", 0#, 0), 1)
            'Flanke 2 durchlaufend
            strStossstelle = "T-Stoss, flankierende Wand durchlaufend"
            .txtKFf3 = Round(calc_Holzbau_single.Kij_HB(VIBROAKUSTIK, strStossstelle, "Ff", "horizontal", 0#, 0), 1)
            .txtKFf4 = Round(calc_Holzbau_single.Kij_HB(VIBROAKUSTIK, strStossstelle, "Fd", "horizontal", 0#, 0), 1)
            
        ElseIf .cboWandtyp = MHW And .cboFlankentyp <> MHW Then
            If IsNumeric(.txtSi_Diagonal) And .txtSi_Diagonal > 0 And IsNumeric(.txtSj_Diagonal) And .txtSj_Diagonal > 0 Then
                strStossstelle = "T-Stoss, flankierende Wand unterbrochen"
                .txtKFf1 = Round(calc_Holzbau_single.Kij_HB(VIBROAKUSTIK, strStossstelle, "Ff", "horizontal", 0#, 0), 1)
                .txtKFf2 = "nv": .txtKFf3 = "nv": .txtKFf4 = "nv"
            Else
                .txtSi_Diagonal.BackColor = vbRed: .txtSj_Diagonal.BackColor = vbRed
            End If

        ElseIf .cboWandtyp <> MHW And .cboFlankentyp = MHW Then
            If IsNumeric(.txtSi_Diagonal) And .txtSi_Diagonal > 0 And IsNumeric(.txtSj_Diagonal) And .txtSj_Diagonal > 0 Then
                .txtKFf3 = Round(10 * Log10(.txtlf * (1 / .txtSi_Diagonal + 1 / .txtSj_Diagonal)), 1)
                .txtKFf2 = "nv": .txtKFf1 = "nv": .txtKFf4 = "nv"
           Else
                .txtSi_Diagonal.BackColor = vbRed
            End If
        Else
            MsgBox ("Flankenkombination unbekannt")
        End If
        
        .cmdDiagonalTWdurchlaufend.BackStyle = fmBackStyleTransparent

        Call frmFlankenbauteil_Holz_Initialize(intFlankenNr)
    End With
End Sub
Private Sub txtKFf1_Change()
    clsFlanke(1).KFf = IIf(IsNumeric(frmVBAcousticTrennwand.txtKFf1), frmVBAcousticTrennwand.txtKFf1, -1000)
    clsFlanke(1).KDf = -1000
End Sub
Private Sub txtKFf2_Change()
    clsFlanke(1).KFd = IIf(IsNumeric(frmVBAcousticTrennwand.txtKFf2), frmVBAcousticTrennwand.txtKFf2, -1000)
End Sub
Private Sub txtKFf3_Change()
    clsFlanke(2).KFf = IIf(IsNumeric(frmVBAcousticTrennwand.txtKFf3), frmVBAcousticTrennwand.txtKFf3, -1000)
    clsFlanke(2).KDf = -1000
End Sub
Private Sub txtKFf4_Change()
    clsFlanke(2).KFd = IIf(IsNumeric(frmVBAcousticTrennwand.txtKFf4), frmVBAcousticTrennwand.txtKFf4, -1000)
End Sub
Private Sub txtSi_Diagonal_Change()
    frmVBAcousticTrennwand.txtSi_Diagonal.BackColor = &H8000000F                'ggf. rote Hintrgrundfarbe zurücksetzen
End Sub
Private Sub txtSj_Diagonal_Change()
    frmVBAcousticTrennwand.txtSj_Diagonal.BackColor = &H8000000F                'ggf. rote Hintrgrundfarbe zurücksetzen
End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''                                                                                            ''''''''''''''''
''''''''''''                   INSTALLATIONSEBENEN                                                      ''''''''''''''''
''''''''''''                                                                                            ''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cmdAuswahlInstSR_Flanke_Click() 'Senderaum
    With frmVBAcousticTrennwand
        If .cboFlankentyp = MW Or .cboFlankentyp = SBD Then
            frmf0.Show
            If frmf0.txtd = "" Then frmf0.txtd = 0
            If frmf0.txts = "" Then frmf0.txts = 0
            .txtDRwSR_Flanke = calc_Massivbau_single.DRwVSSchale(frmf0.txtd, frmf0.txts, frmf0.txtmGW, frmf0.txtmVS, .txtRwFlanke)
        Else
            frmDR_VS.Show
            .txtDRwSR_Flanke = frmDR_VS.txtDRw
        End If
    End With
End Sub
Private Sub txtDRwSR_Flanke_Change()    'Übergabe an Flankenobjekt
    frmVBAcousticTrennwand.txtDRwSR_Flanke.BackColor = &H8000000F                'ggf. rote Hintrgrundfarbe zurücksetzen
    Call frmFlankenbauteil_Holz_Initialize(intFlankenNr)
End Sub
Private Sub cmdAuswahlInstER_Flanke_Click() 'Empfangsraum
    With frmVBAcousticTrennwand
        If .cboFlankentyp = MW Or .cboFlankentyp = SBD Then
            frmf0.Show
            If frmf0.txtd = "" Then frmf0.txtd = 0
            If frmf0.txts = "" Then frmf0.txts = 0
            .txtDRwER_Flanke = calc_Massivbau_single.DRwVSSchale(frmf0.txtd, frmf0.txts, frmf0.txtmGW, frmf0.txtmVS, .txtRwFlanke)
        Else
            frmDR_VS.Show
            .txtDRwER_Flanke = frmDR_VS.txtDRw
        End If
    End With
End Sub
Private Sub txtDRwER_Flanke_Change()    'Übergabe an Flankenobjekt
    frmVBAcousticTrennwand.txtDRwER_Flanke.BackColor = &H8000000F                'ggf. rote Hintrgrundfarbe zurücksetzen
    Call frmFlankenbauteil_Holz_Initialize(intFlankenNr)
End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''                                                                                            ''''''''''''''''
''''''''''''                   DATENÜBERGABE                                                            ''''''''''''''''
''''''''''''                                                                                            ''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Flankenauswahldialog: Flankendaten in Klasse übernehmen                   '''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cmdDatenuebernehmen_Click()

    Application.Workbooks(VBAcoustic).Activate
    
    'Trennbauteil: Holzwand, Flanke: Holzständer-, Metallständer- oder Massivholz- oder Massivbau-Element
    If frmVBAcoustic.optWand = True And frmVBAcoustic.optHolzbau = True Then

        With frmVBAcousticTrennwand
            
            'Fläche des Trennbauteils
            If bStatuscmd0m2_Holz = True Then               'Datenübergabe, wenn Räume diagonal zueinander stehen
                clsWand(1).Raumhoehe = 0.001            'Werte vernachlässigbar klein, aber nicht = 0 setzen
                clsWand(1).Raumbreite = 0.001           'Werte vernachlässigbar klein, aber nicht = 0 setzen
                clsWand(1).Flaeche = 0.01               'Werte vernachlässigbar klein, aber nicht = 0 setzen
            Else
                If (IsNumeric(.txtRaumbreite_Holz) And IsNumeric(.txtRaumhoehe_Holz)) Then
                    clsWand(1).Flaeche = .txtRaumbreite_Holz * .txtRaumhoehe_Holz
                Else
                    clsWand(1).Flaeche = 0
                End If
           
            End If
            
            'Aufruf der Datenübergabe
            Call clsFlanke(intFlankenNr).Dateninput
    
            'Rahmen ausblenden
            .frmFlankenbauteil.Visible = False
    
            'Flanke in Trennwandeingabe als gedrückt markieren
            frmVBAcousticTrennwand("cmdFlanke" & intFlankenNr & "_Holz").BackColor = &H8000000F
            Call frmTrennWandHolzbau_Initialize
            
            'Flankenbild zuruecksetzen
            .ImgFlankensituation10m2.Picture = LoadPicture("")
            .ImgFlankensituation10m2.Picture = .imgFlankenBlank.Picture

        End With
        
    End If
    
End Sub



''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''             #####     #############   ##########    ######          ##################     ''''''''
''''''''''''''''''''           ##     ##         #         #             #    ###            #  #       #       ''''''''
''''''''''''''''''''          ##       #         #         #             #      ##           #  #       #       ''''''''
''''''''''''''''''''           ##                #         #             #      ##           #   #     #        ''''''''
''''''''''''''''''''            ####             #         #             #    ###            #   #     #        ''''''''
''''''''''''''''''''               ####          #         #########     ######              #    #   #         ''''''''
''''''''''''''''''''                  ##         #         #             #                   #    #   #         ''''''''
''''''''''''''''''''           #       ##        #         #             #                   #     # #          ''''''''
''''''''''''''''''''           ##     ##         #         #             #                   #      #           ''''''''
''''''''''''''''''''             #####           #         ##########    #                #################     ''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''            Berechnungsstart mit Datencheck                                                 ''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Berechnung starten (Werte in Excelsheet übertragen)                     ''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cmdBerechnungsstart_Click()
    
    'Check ob alle Flanken eingegeben wurden
    With frmVBAcousticTrennwand
    
        'pdf schließen (falls offen)
        If .WebBrowserPDF.Visible = True Then Call pdfclose
        
        'Flankendarstellung zurücksetzen
        Call ChangeFlankenBild(0, True)
        
        'Berechnung starten
        Call application_Main.Berechnungsstart 'Berechnung starten
        
    End With

End Sub




''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''             #####     #############   ##########    ######            #################    ''''''''
''''''''''''''''''''           ##     ##         #         #             #    ###              #       #        ''''''''
''''''''''''''''''''          ##       #         #         #             #      ##             #       #        ''''''''
''''''''''''''''''''           ##                #         #             #      ##              #     #         ''''''''
''''''''''''''''''''            ####             #         #             #    ###               #     #         ''''''''
''''''''''''''''''''               ####          #         #########     ######                  #   #          ''''''''
''''''''''''''''''''                  ##         #         #             #                       #   #          ''''''''
''''''''''''''''''''           #       ##        #         #             #                        # #           ''''''''
''''''''''''''''''''           ##     ##         #         #             #                         #            ''''''''
''''''''''''''''''''             #####           #         ##########    #                  #################   ''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''            Verifizierung und Validierung                                                   ''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

Private Sub cmdVerifizierung_Click()
    Application.Workbooks(VBAcoustic).Activate
    Call Validierung.Verifizierungsstart
End Sub
Private Sub cmdValidierung_Click()
    Application.Workbooks(VBAcoustic).Activate
    Call Validierung.Validierungsstart
End Sub
Private Sub cmdValidierungsdaten_Click()
    Application.Workbooks(VBAcoustic).Activate
    Call Validierung.NeuerDatensatz_Trennwand(0)
End Sub
Private Sub cmdpdf_TW_Click()
    Call global_Function_Variables.pdfclose         'pdf  schließen
    frmVBAcousticTrennwand.frmValidierung.Visible = False    'Rahmen "frmValidierung" ausblenden
End Sub

