'
'
'
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''            Anwendungsoberfläche von VBAcoustic                      '''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'
Option Explicit
'
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''            Deklaration der Variablen auf Modulebene                 '''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private intFlankenNr As Integer
Private wshshell As Object
Private bNichtmehrAnzeigen







Private Sub frmTrenndeckeHolzbau_Click()

End Sub

Private Sub imgFlanke1_BeforeDragOver(ByVal Cancel As MSForms.ReturnBoolean, ByVal Data As MSForms.DataObject, ByVal X As Single, ByVal Y As Single, ByVal DragState As MSForms.fmDragState, ByVal Effect As MSForms.ReturnEffect, ByVal Shift As Integer)

End Sub

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

    With frmVBAcousticTrenndecke

        'Auflösung kontrollieren, und Mindestgröße festlegen
        If bScaling = True Then
        
            intAppHeight = Application.Height
            intAppWidth = Application.Width
            
        ElseIf Application.Height < 558 And Application.Width < 1032 Then

            .ScrollHeight = intAppHeight                                'Vertikale Bildlaufleiste einfügen
            .ScrollWidth = intAppWidth                                  'Horizontale Bildlaufleiste einfügen
            .KeepScrollBarsVisible = fmScrollBarsBoth

        ElseIf Application.Height < 558 Then

            .ScrollHeight = intAppHeight                                'Vertikale Bildlaufleiste einfügen
            .KeepScrollBarsVisible = fmScrollBarsVertical

        ElseIf Application.Width < 1032 Then

            .ScrollWidth = intAppWidth                                  'Horizontale Bildlaufleiste einfügen
            .KeepScrollBarsVisible = fmScrollBarsHorizontal

        Else

            .KeepScrollBarsVisible = fmScrollBarsNone                   'Bildlaufleisten ausblenden

        End If

        'Darstellung skalieren
        Call global_Function_Variables.SetDeviceIndependentWindow(Me)

        'Anwendungsoberfläche auf Bildschirmgröße skalieren
        .Height = frmVBAcoustic.Height
        .Width = frmVBAcoustic.Width
        .Top = frmVBAcoustic.Top
        .Left = frmVBAcoustic.Left

        .frmFlankenwand.Visible = False
        .WebBrowserPDF.Visible = False

    End With

End Sub
'
'
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''                                                                                            ''''''''
'''''''''''''''''''''             #####     #############   ##########    ######               ###########       ''''''''
'''''''''''''''''''''           ##     ##         #         #             #    ###                 #  #          ''''''''
'''''''''''''''''''''          ##       #         #         #             #      ##                #  #          ''''''''
'''''''''''''''''''''           ##                #         #             #      ##                #  #          ''''''''
'''''''''''''''''''''            ####             #         #             #    ###                 #  #          ''''''''
'''''''''''''''''''''               ####          #         #########     ######                   #  #          ''''''''
'''''''''''''''''''''                  ##         #         #             #                        #  #          ''''''''
'''''''''''''''''''''           #       ##        #         #             #                        #  #          ''''''''
'''''''''''''''''''''           ##     ##         #         #             #                        #  #          ''''''''
'''''''''''''''''''''             #####           #         ##########    #                     ##########       ''''''''
'''''''''''''''''''''                                                                                            ''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''                                                                                            ''''''''
'''''''''''''''''''''            Programmsteuerung                                                               ''''''''
'''''''''''''''''''''                                                                                            ''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Programmsteuerungsdialog initialisieren                                                    ''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Public Sub frmProgrammsteuerungTrenndecke_Initialize()

    Dim intTopPOS As Integer
    Dim intSpace As Integer


    With frmVBAcousticTrenndecke
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
        
        If PDFextern = True Then                                                    'PDF Ausgabe steuern
            frmVBAcousticTrenndecke.optPDFViewer = True
        Else
            frmVBAcousticTrenndecke.optPDFhier = True
        End If

    End With


End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''    Programmsteuerungsdialog: "Einzahlwertberechnung" oder "frequenzabhängige Berechnung" auswählen    '''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub optFrequenzabhaengig_Click()
    Application.Workbooks(VBAcoustic).Activate
    Dim inti As Integer
    frmWarningMessage.Caption = "sorry"
    frmWarningMessage.Show
    optEinzahlwertISO12354 = True
End Sub
Private Sub optEinzahlwertDIN4109_Click()
    Application.Workbooks(VBAcoustic).Activate
    bDIN4109 = True
    With frmVBAcousticTrenndecke
        If .WebBrowserPDF.Visible = True Then Call pdfclose
        .cmdFlankeDIN4109.Visible = True
        .cmdFlanke1.Visible = False: .cmdFlanke2.Visible = False
        .cmdFlanke3.Visible = False: .cmdFlanke4.Visible = False
        frmVBAcousticTrenndecke.optEinzahlwertDIN4109 = True
    End With
End Sub
Private Sub optEinzahlwertISO12354_Click()
    Application.Workbooks(VBAcoustic).Activate
    bDIN4109 = False
    With frmVBAcousticTrenndecke
        If .WebBrowserPDF.Visible = True Then Call pdfclose
        .cmdFlankeDIN4109.Visible = False
        .cmdFlanke1.Visible = True: .cmdFlanke2.Visible = True
        .cmdFlanke3.Visible = True: .cmdFlanke4.Visible = True
        frmVBAcousticTrenndecke.optEinzahlwertISO12354 = True
    End With
End Sub

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''    Programmsteuerungsdialog: bei click "Bauteileingabe" bisherige Auswahl zurücksetzen   '''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cmdBauteileingabe_Click()
    Application.Workbooks(VBAcoustic).Activate
    Call frmTrenndeckeHolzbau_restart
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

'#####################################################################################################################################

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
''''''''''''''''''''            Bauteilauswahl                                                                  ''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Bauteilauswahldialog initialisieren                                                        ''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Public Sub frmTrenndeckeHolzbau_Initialize()

    Dim TopNeu As Integer: TopNeu = 20  'Aktuelle obere Kante des neuen Rahmens
    Dim objShape As Shape               'Zeichenelement im Tabellenblatt
    Dim inti As Integer
        
    With frmVBAcousticTrenndecke

        'Platzieren des Hauptrahmens
        .frmTrenndeckeHolzbau.Top = 0                           'Position vom oberen Bildschirmrand festlegen
        .frmTrenndeckeHolzbau.Height = .Height - _
        IIf(Application.Width < 1032, 0, 30)                   'Rahmenhöhe festlegen
        .frmTrenndeckeHolzbau.Left = 0                          'Position vom linken Bildschirmrand festlegen
        
        
        'Einblenden der Unterrahmen
        .frmBauteilsammlung.Visible = IIf(.cboEstrichtyp <> "" And .cboTrennbauteil <> "", True, False)
        .cmdBerechnungsstart.Visible = IIf(.txtRw <> "" And .txtLnw <> "", True, False)
        
        'Für "Massivholzdecke" ,"Massivholzdecke mit Unterdecke" ,
        '"Holz-Beton-Verbunddecke" ,"Rippen/-Kastenelementdecke"
        If .cboTrennbauteil.Text = MHD Or _
           .cboTrennbauteil.Text = MHD_UD Or _
           .cboTrennbauteil.Text = MHD_RIPPEN_KASTEN Or _
           .cboTrennbauteil.Text = MHD_HBV Then
            .frmRohdecke.Visible = IIf(.txtRw <> "" And .txtLnw <> "", True, False)
            .frmUnterdecke.Visible = False
            .frmFlankierendeWaende.Visible = IIf(.txtRw <> "" And .txtLnw <> "", True, False)
            
        ElseIf .cboTrennbauteil.Text = MHD_UD Then
            .frmRohdecke.Visible = IIf(.txtRw <> "" And .txtLnw <> "", True, False)
            .frmUnterdecke.Visible = IIf(.txtRw <> "" And .txtLnw <> "", True, False)
            .frmFlankierendeWaende.Visible = IIf(.txtRw <> "" And .txtLnw <> "" And .txtDRUnterdecke <> "" And .txtDLUnterdecke <> "", True, False)
            .txtDRUnterdecke.BackColor = vbRed
            .txtDLUnterdecke.BackColor = vbRed

        Else
            .frmRohdecke.Visible = False
            .frmUnterdecke.Visible = False
            .frmFlankierendeWaende.Visible = IIf(.txtRw <> "" And .txtLnw <> "", True, False)
            .txtL1.BackColor = IIf(IsNumeric(.txtL1), &H8000000F, vbRed)
            .txtL2.BackColor = IIf(IsNumeric(.txtL2), &H8000000F, vbRed)
        End If

        'Vorbelegung und Formatierung der Felder
        Workbooks(VBAcoustic).Activate
        If .cboEstrichtyp.ListCount = 0 Then
            .cboEstrichtyp.AddItem ZE_MF
            .cboEstrichtyp.AddItem ZE_WF
            .cboEstrichtyp.AddItem TE
        End If
        If .cboTrennbauteil.ListCount = 0 Then
            .cboTrennbauteil.AddItem HBD_OFFEN
            .cboTrennbauteil.AddItem HBD_L_GK
            .cboTrennbauteil.AddItem HBD_ABH_GK
            .cboTrennbauteil.AddItem HBD_ABH_2GK
            .cboTrennbauteil.AddItem MHD
            .cboTrennbauteil.AddItem MHD_UD
            .cboTrennbauteil.AddItem MHD_RIPPEN_KASTEN
            .cboTrennbauteil.AddItem MHD_HBV
        End If
        
        'Zur Auswahl stehende Bauteilkataloge anzeigen
        .cmdDIN4109.Visible = IIf(BTK_DIN4109_33 = True, True, False)
        .cmdTHRosenheim.Visible = IIf(BTK_TH_Rosenheim = True, True, False)

        'ggf. geöffnetes Ergebnis-pdf schließen und PDF-Ausgabe steuern
        If .WebBrowserPDF.Visible = True Then Call pdfclose
        .frmErgebnisdarstellung.Top = Application.Height / 2 - .frmErgebnisdarstellung.Height / 2
        .frmErgebnisdarstellung.Left = Application.Width / 2 - .frmErgebnisdarstellung.Width / 2

        'Bereits gewählte Angaben zum Trennbauteil im Excel-Tabellenblatt löschen
        Application.ActiveSheet.ImgBauteilskizze.Picture = LoadPicture("")      'Bild löschen
        Application.ActiveSheet.ImgKonstruktion1.Picture = LoadPicture("")      'Konstruktionsdetails löschen
        Application.ActiveSheet.[Quelle] = ""                                   'Quelle löschen
        Call Tabelle2.initialize_Bauteilschichten                               'Vorhandene Bilder löschen
        
        If bDebug = True Then
            .frmDebugfunktionen.Top = Application.Height / 4
            .frmDebugfunktionen.Left = Application.Width / 2 - .frmDebugfunktionen.Width / 2
            .frmDebugfunktionen.Visible = True
        End If

    End With

End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Bauteilauswahldialog: Vorbelgete Felder für Neustart zurücksetezen     ''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Sub frmTrenndeckeHolzbau_restart()
    
    With frmVBAcousticTrenndecke
        .cboEstrichtyp = ""
        .cboTrennbauteil = "":
        .txtDRUnterdecke = ""
        .txtRw = "": .txtLnw = ""
        .txtL1 = "": .txtL2 = ""
        .frmValidierung.Visible = False
    End With

End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Bauteilauswahldialog: Estrichauswahl                                   ''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cboEstrichtyp_Change()
    Application.Workbooks(VBAcoustic).Activate
    With frmVBAcousticTrenndecke
        .cboEstrichtyp.BackColor = &H8000000F               'ggf. rote Hintrgrundfarbe zurücksetzen
        clsDecke(1).Estrichtyp = cboEstrichtyp.Text         'Estrichtyp in Klasse abspeichern
        .txtRw = "": .txtLnw = "": .txtDRUnterdecke = ""    'Bereits eingegebene Einzahlwerte zurücksetzen
        Call frmTrenndeckeHolzbau_Initialize                'Formatierung aktualisieren
    End With
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Bauteilauswahldialog: Deckenauswahl und ggf. Rahmen "Unterdecke"  einblenden               ''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cboTrennbauteil_Change()
    Application.Workbooks(VBAcoustic).Activate
    With frmVBAcousticTrenndecke
        .cboTrennbauteil.BackColor = &H8000000F             'ggf. rote Hintrgrundfarbe zurücksetzen
        clsDecke(1).Deckentyp = cboTrennbauteil.Text        'Trennbauteiltyp in Klasse abspeichern
        .txtRw = "": .txtLnw = "": .txtDRUnterdecke = ""    'Bereits eingegebene Einzahlwerte zurücksetzen
        Call frmTrenndeckeHolzbau_Initialize                'Formatierung aktualisieren
        Call cboStossstelle_Change                          'Stoßstellendämm-Maße aktualisieren (Deckenabhängig)
    End With
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Bauteilauswahldialog: Bauteildatenbanken öffnen                                            ''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cmdDataholz_Click()
    Application.Workbooks(VBAcoustic).Activate
    Set wshshell = CreateObject("WScript.Shell")
    wshshell.Run "https://www.dataholz.eu/bauteile/geschossdecke.htm"
End Sub
Private Sub cmdVaBDat_Click()
    Application.Workbooks(VBAcoustic).Activate
    Set wshshell = CreateObject("WScript.Shell")
    wshshell.Run "https://www.VaBDat.de"
End Sub
Public Sub cmdDIN4109_Click()
    Application.ScreenUpdating = False                                                  ' im Hintergrund ohne Anzeige
    Application.Workbooks(VBAcoustic).Activate
    If frmVBAcousticTrenndecke.WebBrowserPDF.Visible = True Then Call pdfclose          'ggf. geöffnetes Ergebnis-pdf schließen
    BTK_DIN4109_33 = openfile("Bauteilkatalog_DIN4109_33.xlsm")                         'Datei zum Bauteilkatalog DIN4109-33 öffnen
    Application.Workbooks(VBAcoustic).Activate
    Application.Run "'Bauteilkatalog_DIN4109_33.xlsm'!DIN4109_start.DIN4109_33_Decken", _
    frmVBAcousticTrenndecke.cboTrennbauteil, frmVBAcousticTrenndecke.cboEstrichtyp, _
    frmVBAcousticTrenndecke.Left, VBAcoustic                                            'Bauteil auswählen/einlesen
    Application.ScreenUpdating = True
    Application.Workbooks("Bauteilkatalog_DIN4109_33.xlsm").Close                       'Datei schließen
    Application.Workbooks(VBAcoustic).Activate                                           'VBAcoustic aktiv setzen
End Sub
Public Sub cmdTHRosenheim_Click()
    Dim inti As Integer
    Application.ScreenUpdating = False                                                  'im Hintergrund ohne Anzeige
    Application.Workbooks(VBAcoustic).Activate
    If frmVBAcousticTrenndecke.WebBrowserPDF.Visible = True Then Call pdfclose          'ggf. geöffnetes Ergebnis-pdf schließen
    BTK_TH_Rosenheim = openfile("Bauteilkatalog_TH_Rosenheim.xlsm")                     'Datei zum Bauteilkatalog TH Rosenheim öffnen
    Application.Workbooks(VBAcoustic).Activate
    
    If Application.Ready = True Then
        'Bauteilkatalog "Decken" darstellen und Bauteil auswählen/einlesen
        Application.Run "'Bauteilkatalog_TH_Rosenheim.xlsm'!TH_Rosenheim_start.TH_Rosenheim_Decken", _
        frmVBAcousticTrenndecke.cboTrennbauteil, frmVBAcousticTrenndecke.cboEstrichtyp, _
        frmVBAcousticTrenndecke.Left, VBAcoustic
    Else
        Application.Workbooks(VBAcoustic).Activate
        inti = MsgBox("Bauteilkatalog konte nicht geöffnet werden.", vbRetryCancel + vbCritical, "VBAcoustic")
        If inti = 4 Then
            Application.Run "'Bauteilkatalog_TH_Rosenheim.xlsm'!TH_Rosenheim_start.TH_Rosenheim_Decken", _
            frmVBAcousticTrenndecke.cboTrennbauteil, frmVBAcousticTrenndecke.cboEstrichtyp, _
            frmVBAcousticTrenndecke.Left, VBAcoustic
        End If
    End If

    Application.ScreenUpdating = True
    Application.Workbooks("Bauteilkatalog_TH_Rosenheim.xlsm").Close                     'Datei schließen
    Workbooks(VBAcoustic).Activate                                                      'VBAcoustic aktiv setzen
End Sub

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Bauteilauswahldialog: Bauteilabmessungen wählen                                            ''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub txtL1_Change()
    Application.Workbooks(VBAcoustic).Activate
    With frmVBAcousticTrenndecke
        If .WebBrowserPDF.Visible = True Then Call pdfclose                         'ggf. geöffnetes Ergebnis-pdf schließen
        .txtL1.BackColor = &H8000000F                                               'ggf. rote Hintrgrundfarbe zurücksetzen
        
        If IsNumeric(.txtL1) Then
            clsFlanke(1).lfSR = .txtL1                                              'Kantenlänge in der Klasse abspeichern
            If .chkRechteckraum = True Then
                If IsNumeric(.txtL2) Then clsDecke(1).Flaeche = .txtL2 * .txtL1     'Deckenfläche aktualisieren
                clsFlanke(3).lfSR = .txtL1                                          'Kantenlänge in der Klasse abspeichern
            Else
                clsDecke(1).Flaeche = .txtSDecke
            End If
        End If
    End With
End Sub

Private Sub txtL2_Change()
    Application.Workbooks(VBAcoustic).Activate
    With frmVBAcousticTrenndecke
        If .WebBrowserPDF.Visible = True Then Call pdfclose                         'ggf. geöffnetes Ergebnis-pdf schließen
        .txtL2.BackColor = &H8000000F                                               'ggf. rote Hintrgrundfarbe zurücksetzen
        If IsNumeric(.txtL2) Then
            clsFlanke(2).lfSR = .txtL2                                              'Kantenlänge in der Klasse abspeichern
            If .chkRechteckraum = True Then
                If IsNumeric(.txtL1) Then clsDecke(1).Flaeche = .txtL2 * .txtL1     'Deckenfläche aktualisieren
                clsFlanke(4).lfSR = .txtL2                                          'Kantenlänge in der Klasse abspeichern
            Else
                clsDecke(1).Flaeche = .txtSDecke
            End If
        End If
    End With
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Bauteilauswahldialog: Flächenbezogene Masse der Massivholzdecke+Beschwerung eingeben       ''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub txtMasseDecke_Change()
    Application.Workbooks(VBAcoustic).Activate
    With frmVBAcousticTrenndecke
        If .WebBrowserPDF.Visible = True Then Call pdfclose                         'ggf. geöffnetes Ergebnis-pdf schließen
        .txtMasseDecke.BackColor = &H8000000F                                       'ggf. rote Hintrgrundfarbe zurücksetzen
        clsDecke(1).mElement = IIf(IsNumeric(.txtMasseDecke), .txtMasseDecke, 0)
        If .txtMasseDecke >= 30 And .txtMasseDecke <= 300 Then                      'Schalldämm-Maß von Decke+Beschwerung prognostizieren
            If .txtBiegeweich = "ja" Then
                .txtRsw = Round(Rw_beschwert(CDbl(.txtMasseDecke)), 0)
            Else
                .txtRsw = Round(Rw_HB(CDbl(.txtMasseDecke)), 0)
            End If
        Else
            .txtRsw = ""
        End If
    End With
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Bauteilauswahldialog: Schalldämm-Maß der Massivholzdecke+Beschwerung eingeben              ''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub txtRsw_Change()
    Application.Workbooks(VBAcoustic).Activate
    With frmVBAcousticTrenndecke
        clsDecke(1).Rsw = IIf(IsNumeric(.txtRsw), .txtRsw, 0)
        .txtRsw.BackColor = &H8000000F                                              'ggf. rote Hintrgrundfarbe zurücksetzen
        If .WebBrowserPDF.Visible = True Then Call pdfclose                         'ggf. geöffnetes Ergebnis-pdf schließen
    End With
End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Bauteilauswahldialog: Verbesserung durch Unterdecke eingeben                               ''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Public Sub txtDRUnterdecke_Change()
    Application.Workbooks(VBAcoustic).Activate
    With frmVBAcousticTrenndecke
        .txtDRUnterdecke.BackColor = &H8000000F                                     'ggf. rote Hintrgrundfarbe zurücksetzen
        If .WebBrowserPDF.Visible = True Then Call pdfclose                         'ggf. geöffnetes Ergebnis-pdf schließen
        If IsNumeric(.txtDRUnterdecke) Then clsDecke(1).DRUnterdecke = .txtDRUnterdecke Else clsDecke(1).DRUnterdecke = 0
        If IsNumeric(.txtDRUnterdecke) Then
            .frmFlankierendeWaende.Visible = True
            .txtL1.BackColor = IIf(IsNumeric(.txtL1), &H8000000F, vbRed)
            .txtL2.BackColor = IIf(IsNumeric(.txtL2), &H8000000F, vbRed)
        End If
    End With
End Sub
Private Sub txtDLUnterdecke_Change()
    Application.Workbooks(VBAcoustic).Activate
    With frmVBAcousticTrenndecke
        .txtDLUnterdecke.BackColor = &H8000000F                                     'ggf. rote Hintrgrundfarbe zurücksetzen
        If .WebBrowserPDF.Visible = True Then Call pdfclose                         'ggf. geöffnetes Ergebnis-pdf schließen
        If IsNumeric(.txtDLUnterdecke) Then clsDecke(1).DLUnterdecke = .txtDLUnterdecke Else clsDecke(1).DLUnterdecke = 0
        If IsNumeric(.txtDRUnterdecke) Then
            .frmFlankierendeWaende.Visible = True
            .txtL1.BackColor = IIf(IsNumeric(.txtL1), &H8000000F, vbRed)
            .txtL2.BackColor = IIf(IsNumeric(.txtL2), &H8000000F, vbRed)
        End If
    End With

End Sub



''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Bauteilauswahldialog: Einzahlwerte eingeben                                                ''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub txtLnw_Change()
    Application.Workbooks(VBAcoustic).Activate
    With frmVBAcousticTrenndecke
        If clsDecke(1).Deckentyp = MHD_UD And .txtLnw < 10 Then 'Manuelle Eingabe bei diesem Deckentyp abfangen
            Call frmWarningMessage.WarningMessage("Decke aus Bauteilkatalog auswählen", "Warning")
            .txtRw = "": .txtLnw = "": .txtDRUnterdecke = ""    'Bereits eingegebene Einzahlwerte zurücksetzen
        Else
            .txtLnw.BackColor = &H8000000F                                              'ggf. rote Hintrgrundfarbe zurücksetzen
            If IsNumeric(.txtLnw) Then clsDecke(1).Lnw = .txtLnw Else clsDecke(1).Lnw = 0
            clsDecke(1).CI50 = -1000
        End If
            Call frmTrenndeckeHolzbau_Initialize                                         'Formatierung aktualisieren
    End With
End Sub
Private Sub txtRw_Change()
    Application.Workbooks(VBAcoustic).Activate
    With frmVBAcousticTrenndecke
        If clsDecke(1).Deckentyp = MHD_UD And .txtRw < 10 Then 'Manuelle Eingabe bei diesem Deckentyp abfangen
            Call frmWarningMessage.WarningMessage("Decke aus Bauteilkatalog auswählen", "Warning")
            .txtRw = "": .txtLnw = "": .txtDRUnterdecke = ""    'Bereits eingegebene Einzahlwerte zurücksetzen
        Else
            .txtRw.BackColor = &H8000000F                                               'ggf. rote Hintrgrundfarbe zurücksetzen
            If IsNumeric(.txtRw) Then clsDecke(1).Rw = .txtRw Else clsDecke(1).Rw = 0
        End If
            Call frmTrenndeckeHolzbau_Initialize                                         'Formatierung aktualisieren
    End With
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Flanken nach DIN 4109 berechnen                                                            ''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cmdFlankeDIN4109_Click()
    Application.Workbooks(VBAcoustic).Activate
    With frmVBAcousticTrenndecke

        'Vor der Flankenauswahl müssen die Deckenabmessungen eingegeben werden
        If IsNumeric(.txtL1) And IsNumeric(.txtL2) Then 'Alles gut
        Else
            Call frmWarningMessage.WarningMessage("Zuerst die Raumabmessungen eingeben", "Warning")
            .txtL1.BackColor = vbRed: .txtL2.BackColor = vbRed:
            Exit Sub
        End If

        'Standard
        If frmVBAcousticTrenndecke.WebBrowserPDF.Visible = True Then Call pdfclose            'ggf. geöffnetes Ergebnis-pdf schließen
        .frmValidierung.Visible = False
        frmVBAcousticTrenndecke.cmdFlankeDIN4109.BackColor = &H8000000F                       'ggf. rote Hintrgrundfarbe zurücksetzen

        'Voreinstellungen für die Flankenauswahl nach DIN4109
        intFlankenNr = 1: Call frmFlankenwand_Initialize(intFlankenNr)              'Flankendialog initialisieren
        .frmFlankenwand.Caption = "Flankierende Wände"                              'Überschrift der Dialogbox anpassen
        .chkSymmetrie.Visible = False                                               'Symmetrieauswahl ausblenden
        .lblDnfw.Visible = False: lblDnfw2.Visible = False: .lblDnfwIndex.Visible = False                    'Eingabefeld für Dnfw ausblenden
        .txtDnfwSR.Visible = False: .lblDnfWdB.Visible = False                      'Eingabefeld für Dnfw ausblenden
        .lbllf.Visible = False: .lbllf2.Visible = False: .lbllfIndex.Visible = False                        'Eingabefeld für Kantenlänge ausblenden
        .txtlfSR.Visible = False: .lbllfm.Visible = False                           'Eingabefeld für Kantenlänge ausblenden

    End With
End Sub



''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Bauteilauswahldialog: Daten für Flankenwand 1 bis 4 abfragen                               ''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cmdFlanke1_Click()
    Application.Workbooks(VBAcoustic).Activate
    With frmVBAcousticTrenndecke
    intFlankenNr = 1
    If .WebBrowserPDF.Visible = True Then Call pdfclose
    .frmValidierung.Visible = False
    .frmDebugfunktionen.Visible = False
    Call ChangeFlankenBild(intFlankenNr, False)
    Call frmFlankenwand_Initialize(intFlankenNr)
    .cmdFlanke1.BackStyle = 0
    .cmdFlanke1.BackColor = &H8000000F                                 'ggf. rote Hintrgrundfarbe zurücksetzen
    .lblDnfw.Visible = True: .lblDnfw2.Visible = True: .lblDnfwIndex.Visible = True             'Eingabefeld für Dnfw ausblenden
    .txtDnfwSR.Visible = True: .lblDnfWdB.Visible = True               'Eingabefeld für Dnfw ausblenden
    .lbllf.Visible = True: .lbllf2.Visible = True: .lbllfIndex.Visible = True                 'Eingabefeld für Kantenlänge ausblenden
    .txtlfSR.Visible = True: .lbllfm.Visible = True                    'Eingabefeld für Kantenlänge ausblenden
    End With
End Sub
Private Sub cmdFlanke2_Click()
    Application.Workbooks(VBAcoustic).Activate
    With frmVBAcousticTrenndecke
    intFlankenNr = 2
    If .WebBrowserPDF.Visible = True Then Call pdfclose
    .frmValidierung.Visible = False
    .frmDebugfunktionen.Visible = False
    Call ChangeFlankenBild(intFlankenNr, False)
    Call frmFlankenwand_Initialize(intFlankenNr)
    .cmdFlanke2.BackStyle = 0
    .cmdFlanke2.BackColor = &H8000000F                                 'ggf. rote Hintrgrundfarbe zurücksetzen
    .lblDnfw.Visible = True: .lblDnfwIndex.Visible = True              'Eingabefeld für Dnfw ausblenden
    .txtDnfwSR.Visible = True: .lblDnfWdB.Visible = True               'Eingabefeld für Dnfw ausblenden
    .lbllf.Visible = True: .lbllfIndex.Visible = True                  'Eingabefeld für Kantenlänge ausblenden
    .txtlfSR.Visible = True: .lbllfm.Visible = True                    'Eingabefeld für Kantenlänge ausblenden
    End With
End Sub
Private Sub cmdFlanke3_Click()
    Application.Workbooks(VBAcoustic).Activate
    With frmVBAcousticTrenndecke
    intFlankenNr = 3
    If .WebBrowserPDF.Visible = True Then Call pdfclose
    .frmValidierung.Visible = False
    .frmDebugfunktionen.Visible = False
    Call ChangeFlankenBild(intFlankenNr, False)
    Call frmFlankenwand_Initialize(intFlankenNr)
    .cmdFlanke3.BackStyle = 0
    .cmdFlanke3.BackColor = &H8000000F                                 'ggf. rote Hintrgrundfarbe zurücksetzen
    .lblDnfw.Visible = True: .lblDnfwIndex.Visible = True              'Eingabefeld für Dnfw ausblenden
    .txtDnfwSR.Visible = True: .lblDnfWdB.Visible = True               'Eingabefeld für Dnfw ausblenden
    .lbllf.Visible = True: .lbllfIndex.Visible = True                  'Eingabefeld für Kantenlänge ausblenden
    .txtlfSR.Visible = True: .lbllfm.Visible = True                    'Eingabefeld für Kantenlänge ausblenden
    End With
End Sub
Private Sub cmdFlanke4_Click()
    Application.Workbooks(VBAcoustic).Activate
    With frmVBAcousticTrenndecke
    intFlankenNr = 4
    If .WebBrowserPDF.Visible = True Then Call pdfclose
    .cmdFlanke4.BackStyle = 0
    .frmValidierung.Visible = False
    .frmDebugfunktionen.Visible = False
    Call ChangeFlankenBild(intFlankenNr, False)
    Call frmFlankenwand_Initialize(intFlankenNr)
    If .WebBrowserPDF.Visible = True Then Call pdfclose
    .frmValidierung.Visible = False
    .frmDebugfunktionen.Visible = False
    .cmdFlanke4.BackColor = &H8000000F                                 'ggf. rote Hintrgrundfarbe zurücksetzen
    .lblDnfw.Visible = True: .lblDnfwIndex.Visible = True              'Eingabefeld für Dnfw ausblenden
    .txtDnfwSR.Visible = True: .lblDnfWdB.Visible = True               'Eingabefeld für Dnfw ausblenden
    .lbllf.Visible = True: .lbllfIndex.Visible = True                  'Eingabefeld für Kantenlänge ausblenden
    .txtlfSR.Visible = True: .lbllfm.Visible = True                    'Eingabefeld für Kantenlänge ausblenden
    End With
End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' 3D Flankendarstellung anpassen                                                             ''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub ChangeFlankenBild(intFlankenNr As Integer, bReset As Boolean)
    With frmVBAcousticTrenndecke
        If bReset = False Then
            .imgFlanken.Picture = LoadPicture("")
            .imgFlanken.Picture = .Controls("imgFlanke" & intFlankenNr).Picture
        Else
        'Flankenbild zuruecksetzen
            .imgFlanken.Picture = LoadPicture("")
            .imgFlanken.Picture = .imgFlankenBlank.Picture
        End If
    End With
End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Bauteilauswahldialog: Flankenauswahldialog initialisieren                                  ''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub frmFlankenwand_Initialize(intFlankenNr As Integer)

Application.Workbooks(VBAcoustic).Activate

With frmVBAcousticTrenndecke

        'Vorbelegung
        .chkSymmetrie.Value = True
        If .cboStossstelle.ListCount = 0 Then
            .cboStossstelle.AddItem T_STOSS
            .cboStossstelle.AddItem T_STOSS_ELAST_OBEN
            .cboStossstelle.AddItem T_STOSS_ELAST_OBEN_UNTEN
            .cboStossstelle.AddItem X_STOSS
            .cboStossstelle.AddItem X_STOSS_ELAST_OBEN
            .cboStossstelle.AddItem X_STOSS_ELAST_OBEN_UNTEN
        End If
        If .cboBeplankung.ListCount = 0 Then
            .cboBeplankung.AddItem HWST_GK
            .cboBeplankung.AddItem GF
            .cboBeplankung.AddItem HWST
        End If
        If .cboBeplankungER.ListCount = 0 Then
            .cboBeplankungER.AddItem HWST_GK
            .cboBeplankungER.AddItem GF
            .cboBeplankungER.AddItem HWST
        End If
       
        .txtDnfwSR.Text = clsFlanke(intFlankenNr).DnfwSR
        .txtDnfwER.Text = clsFlanke(intFlankenNr).DnfwER
        .txtDRwSR.Text = IIf(bDIN4109 = True, "", .txtDRwSR.Text)
        .txtDRwER.Text = IIf(bDIN4109 = True, "", .txtDRwER.Text)
        If .chkRechteckraum = True Then
            .txtlfSR = IIf(intFlankenNr = 1 Or intFlankenNr = 3, .txtL1, .txtL2)
            .txtlfStoss = IIf(intFlankenNr = 1 Or intFlankenNr = 3, .txtL1, .txtL2)
        Else
            .txtlfSR = clsFlanke(intFlankenNr).lfSR
            .txtlfStoss = clsFlanke(intFlankenNr).lfSR
            .txtlfER = clsFlanke(intFlankenNr).lfER
        End If
        
        .txtlfER = .txtlfSR

        'Rahmen initialisieren
        .frmFlankenwand.Caption = "Flankierende Wand Nr. " & intFlankenNr & ":"
        .frmFlankenwand.Top = 435
        .frmWandtypSymmetrie.Top = 15

        'Ein- Ausblenden
        .frmHolzstaenderwand.Visible = False
        .frmHolzstaenderwandER.Visible = False
        .frmMassivholzwand.Visible = False
        .frmMassivholzwandER.Visible = False
        .frmStossstelle.Visible = False
        .frmInstallationsebene.Visible = False
        .chkSymmetrie.Visible = True
        .frmFlankenwand.Visible = True

        'Bereits vorhandener Wandtyp aus Klasse auslesen
        .cboWandtyp.Text = clsFlanke(intFlankenNr).FlankentypSR
        .cboWandtypER.Text = clsFlanke(intFlankenNr).FlankentypER


        Call chkSymmetrie_Click

    End With

End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Bauteilauswahldialog: Flanke beidseits des Trennbauteils symmetrisch?                      ''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub chkSymmetrie_Click()
    Application.Workbooks(VBAcoustic).Activate
    With frmVBAcousticTrenndecke
    If .chkSymmetrie.Value = True Then                  'Wandtypauswahl initialisieren
        If .cboWandtyp.ListCount = 0 Then
            .cboWandtyp.AddItem HSTW
            .cboWandtyp.AddItem MHW
        ElseIf .cboWandtyp.ListCount = 3 Then
            .cboWandtyp.RemoveItem 2
        End If
        .cboWandtypER.Text = ""
        .lblWandER.Visible = False                       'Beschriftung ausblenden
        .cboWandtypER.Visible = False                    'Combobox "Wandtyp ER" ausblenden
        .lblWandSR.Caption = "Wandtyp"                    'Beschriftung "Wand" aktualisieren
        .chkSymmetrie.Top = 60                              'Kontrollkästchen verschieben
        .frmWandtypSymmetrie.Height = 100
        .frmFlankenwand.Height = 140
    Else
        If .cboWandtyp.ListCount = 0 Then
            .cboWandtyp.AddItem HSTW
            .cboWandtyp.AddItem MHW
            .cboWandtyp.AddItem OHNE
        ElseIf .cboWandtyp.ListCount = 2 Then
            .cboWandtyp.AddItem OHNE
        End If
        If .cboWandtypER.ListCount = 0 Then
            .cboWandtypER.AddItem HSTW
            .cboWandtypER.AddItem MHW
            .cboWandtypER.AddItem OHNE
        ElseIf .cboWandtypER.ListCount = 2 Then
            .cboWandtypER.AddItem OHNE
        End If
        .lblWandER.Visible = True                       'Beschriftung einblenden
        .cboWandtypER.Visible = True                    'Combobox "Wandtyp ER" einblenden
        .lblWandSR.Caption = "Wandtyp, oben"             'Beschriftung "Wand, oben" aktualisieren
        .chkSymmetrie.Top = 80                              'Kontrollkästchen verschieben
        .frmWandtypSymmetrie.Height = 120
        .frmFlankenwand.Height = 160
    End If

    End With

    Call cboWandtypER_Change

End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Bauteilauswahldialog: Flankenauswahldialog nach-initialisieren                             ''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cboWandtyp_Change()
    Application.Workbooks(VBAcoustic).Activate
    frmVBAcousticTrenndecke.cboWandtyp.BackColor = &H8000000F             'ggf. rote Hintrgrundfarbe zurücksetzen
    Call cboWandtypER_Change
End Sub
Private Sub cboWandtypER_Change()

    Dim TopNeu As Integer  'Aktuelle obere Kante des neuen Rahmens

    Application.Workbooks(VBAcoustic).Activate
    With frmVBAcousticTrenndecke

        'Zunächst alles ausblenden
        .frmHolzstaenderwand.Visible = False
        .frmHolzstaenderwandER.Visible = False
        .frmMassivholzwand.Visible = False
        .frmMassivholzwandER.Visible = False
        .frmStossstelle.Visible = False
        .frmInstallationsebene.Visible = False
        .cmduebernehmen.Visible = False

        'Aktuelle obere Kante des neuen Rahmens
        TopNeu = 15 + .frmWandtypSymmetrie.Height + 10

        'Obere flankierende Wand als Holzständer "HSTW" oder Metallständerwand "MSTW"
        If cboWandtyp.Text = HSTW Or cboWandtyp.Text = MSTW Then
            If .chkSymmetrie.Value = True Then
                .frmHolzstaenderwand.Caption = IIf(.cboWandtyp.Text = HSTW, HSTW, MSTW)
            Else
                .frmHolzstaenderwand.Caption = IIf(.cboWandtyp.Text = HSTW, "Holzständerwand, oben", "Metallständerwand, oben")
            End If
            .frmHolzstaenderwand.Top = TopNeu
            .frmHolzstaenderwand.Visible = True
            .cboBeplankung = clsFlanke(intFlankenNr).BeplankungSR
             TopNeu = TopNeu + .frmHolzstaenderwand.Height + 10
             
        'Obere flankierende Wand als Massivholzwand "MHW"
        ElseIf cboWandtyp.Text = MHW And bDIN4109 = False Then
            .frmMassivholzwand.Caption = IIf(.chkSymmetrie.Value = True, MHW, "Massivholzwand, oben")
            .frmMassivholzwand.Top = TopNeu
            .frmMassivholzwand.Visible = True
            .txtMasseWand = clsFlanke(intFlankenNr).WandmasseSR
            .txtRwWand = clsFlanke(intFlankenNr).RwSR
             TopNeu = TopNeu + .frmMassivholzwand.Height + 10
       End If

        'Stoßstelle für Massivholzwände "MHW"
        If (cboWandtyp.Text = MHW Or cboWandtypER.Text = MHW) And bDIN4109 = False Then
            frmVBAcousticTrenndecke.frmStossstelle.Top = TopNeu
            frmVBAcousticTrenndecke.frmStossstelle.Visible = True
            .cboStossstelle = clsFlanke(intFlankenNr).Stossstelle
            .txtKFf = clsFlanke(intFlankenNr).KFf
            .txtKFd = clsFlanke(intFlankenNr).KFd
            .txtKDf = clsFlanke(intFlankenNr).KDf
            TopNeu = TopNeu + .frmStossstelle.Height + 10
        End If

        'Untere flankierende Wand als Holzständer "HSTW" oder Metallständerwand "MSTW"
        If .cboWandtypER.Text = HSTW Or cboWandtypER.Text = MSTW Then
            If .chkSymmetrie.Value = True Then
                .frmHolzstaenderwandER.Caption = IIf(.cboWandtypER.Text = HSTW, HSTW, MSTW)
            Else
                .frmHolzstaenderwandER.Caption = IIf(.cboWandtypER.Text = HSTW, "Holzständerwand, unten", "Metallständerwand, unten")
            End If

            .frmHolzstaenderwandER.Top = TopNeu
            .frmHolzstaenderwandER.Visible = True
            .cboBeplankung = clsFlanke(intFlankenNr).BeplankungER
            TopNeu = TopNeu + .frmHolzstaenderwandER.Height + 10
            
        'Untere flankierende Wand als Massivholzwand "MHW"
        ElseIf cboWandtypER.Text = MHW Then
            .frmMassivholzwandER.Top = TopNeu
            .frmMassivholzwandER.Visible = True
            .txtMasseWandER = clsFlanke(intFlankenNr).WandmasseER
            .txtRwWandER = clsFlanke(intFlankenNr).RwER
            TopNeu = TopNeu + .frmMassivholzwandER.Height + 10

        End If

        'Installationebene
        If (.cboWandtyp.Text <> OHNE And .cboWandtyp.Text <> "" And bDIN4109 = False) Or _
           (.cboWandtypER.Text <> OHNE And .cboWandtypER.Text <> "" And bDIN4109 = False) Then
            .frmInstallationsebene.Top = TopNeu
            .frmInstallationsebene.Visible = True
            .txtDRwSR = clsFlanke(intFlankenNr).DRwSR
            .txtDRwER = clsFlanke(intFlankenNr).DRwER
            TopNeu = TopNeu + .frmInstallationsebene.Height + 10
        End If

        'cmdÜbernehmen-Button darstellen
        If (.cboWandtyp.Text <> OHNE And .cboWandtyp.Text <> "") Or _
           (.cboWandtypER.Text <> OHNE And .cboWandtypER.Text <> "") Then
            .cmduebernehmen.Top = TopNeu
            .cmduebernehmen.Visible = True
            TopNeu = TopNeu + .cmduebernehmen.Height + IIf(Application.Width < 1032, 27, 45)
        End If

        'Rahmengröße festlegen
        .frmFlankenwand.Height = TopNeu + 20
        .frmFlankenwand.Top = IIf(.cboWandtyp.Text = "", intAppHeight / 2, intAppHeight - .frmFlankenwand.Height)

    End With

End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Änderung der Wandbeplankung -> Dnfw anpassen                                                 ''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cboBeplankung_Change()

    Application.Workbooks(VBAcoustic).Activate
    With frmVBAcousticTrenndecke
        If .cboBeplankung.Text = HWST And bDIN4109 = False Then
            .txtDnfwSR.Text = ""
            .txtDnfwER.Text = ""
        Else
            .txtDnfwSR.Text = "67"
            .txtDnfwER.Text = "67"
        End If
    End With
    
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Flankenauswahldialog: Stoßstelle auswählen und Kij anzeigen                                  ''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cboStossstelle_Change()

    Application.Workbooks(VBAcoustic).Activate
    With frmVBAcousticTrenndecke

        If .cboStossstelle.Text = "" Then

            .txtKFf = "": .txtKDf = "": .txtKFd = "": Exit Sub

        Else
            .txtKFf = Kij_HB(clsFlanke(intFlankenNr).KijNorm, .cboStossstelle.Text, "Ff", "vertikal", 0, 0)  'Stoßstellendämm-Maß Weg Ff
            .txtKDf = Kij_HB(clsFlanke(intFlankenNr).KijNorm, .cboStossstelle.Text, "Df", "vertikal", 0, 0)  'Stoßstellendämm-Maß Weg Df
            .txtKFd = Kij_HB(clsFlanke(intFlankenNr).KijNorm, .cboStossstelle.Text, "Fd", "vertikal", 0, 0)  'Stoßstellendämm-Maß Weg Fd

        End If
        'Wenn die Trenndecken kein Massivholzbauteil (nicht Massivholzdecke, Rippen- o. Kastendecke, HBV-Decke) ist,
        'wird Df und Fd auf null gesetzt
        If (.cboTrennbauteil <> MHD) And _
           (.cboTrennbauteil <> MHD_UD) And _
           (.cboTrennbauteil <> MHD_RIPPEN_KASTEN) And _
           (.cboTrennbauteil <> MHD_HBV) Then: .txtKDf = "": .txtKFd = ""
           
        'Wenn die flankierende Wand keine Massivholzwand "MHW" ist, wird Df und Fd auf null gesetzt
        If (.cboWandtyp.Text <> MHW) Then: .txtKFf = "": .txtKFd = ""
        If (.cboWandtypER.Text <> MHW And .chkSymmetrie = False) Then: .txtKFf = "": .txtKDf = ""

    End With

End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Flankenauswahldialog: geänderte Kantelänge übergeben                                         ''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub txtlfStoss_Change()
    Application.Workbooks(VBAcoustic).Activate
    frmVBAcousticTrenndecke.txtlfSR = frmVBAcousticTrenndecke.txtlfStoss
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Flankenauswahldialog: geänderte Deckenfläche übergeben                                         ''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cmdSDeckeUebernehmen_Click()
    Application.Workbooks(VBAcoustic).Activate
    If IsNumeric(frmVBAcousticTrenndecke.txtSDecke) Then
        clsDecke(1).Flaeche = frmVBAcousticTrenndecke.txtSDecke
        frmVBAcousticTrenndecke.frmFlaecheDecke.Visible = False
    End If
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Flankenauswahldialog: Deckenfläche rechteckig?                                               ''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub chkRechteckraum_Click()

Application.Workbooks(VBAcoustic).Activate
With frmVBAcousticTrenndecke
    If .chkRechteckraum = True Then
        If .WebBrowserPDF.Visible = True Then Call pdfclose             'ggf. geöffnetes Ergebnis-pdf schließen
        .txtL1.Visible = True: .Label4.Visible = True                   'Eingabefeld für L1 ausblenden
        .txtL2.Visible = True: .Label5.Visible = True                   'Eingabefeld für L2 ausblenden
        .frmFlaecheDecke.Visible = False
        If IsNumeric(.txtL1) And IsNumeric(.txtL2) Then
            clsDecke(1).Flaeche = .txtL1 * .txtL2
        End If
    Else
        If .WebBrowserPDF.Visible = True Then Call pdfclose             'ggf. geöffnetes Ergebnis-pdf schließen
        .txtL1 = "": .txtL1.Visible = False: .Label4.Visible = False    'Eingabefeld für L1 ausblenden
        .txtL2 = "": .txtL2.Visible = False: .Label5.Visible = False    'Eingabefeld für L2 ausblenden
        .frmFlaecheDecke.Visible = True
        .frmFlaecheDecke.Top = intAppHeight - 2 * .frmFlaecheDecke.Height
        .frmFlaecheDecke.Left = 323
    End If
End With

End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Flankenauswahldialog: Schalldämm-Maß der Wand in Abhängigkeit von m' prognostizieren         ''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub txtMasseWand_Change()
    Dim intSprache As Integer
    Application.Workbooks(VBAcoustic).Activate
    With frmVBAcousticTrenndecke
        If .txtMasseWand >= 30 And .txtMasseWand < 150 Then
            intSprache = Application.International(1)
            .txtRwWand = Round(Rw_HB(CDbl(.txtMasseWand)), 1)
        Else
            .txtRwWand = ""
        End If
    End With
End Sub
Private Sub txtMasseWandER_Change()
    Application.Workbooks(VBAcoustic).Activate
    With frmVBAcousticTrenndecke
        If .txtMasseWandER >= 30 And .txtMasseWandER < 150 Then
            .txtRwWandER = Round(Rw_HB(CDbl(.txtMasseWandER)), 1)
        Else
            .txtRwWandER = ""
        End If
    End With
End Sub





''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Flankenauswahldialog: Verbesserung durch VS-Schale auswählen                                 ''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cmdAuswahl1_Click()

    Application.Workbooks(VBAcoustic).Activate
    frmDR_VS.Show
    frmVBAcousticTrenndecke.txtDRwSR = frmDR_VS.txtDRw

End Sub
Private Sub cmdAuswahl2_Click()

    Application.Workbooks(VBAcoustic).Activate
    frmDR_VS.Show
    frmVBAcousticTrenndecke.txtDRwER = frmDR_VS.txtDRw

End Sub
Private Sub cmdAuswah3_Click()

    Application.Workbooks(VBAcoustic).Activate
    frmDR_VS.Show
    frmVBAcousticTrenndecke.txtDRUnterdecke = frmDR_VS.txtDRw

End Sub



''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Flankenauswahldialog: Flankendaten in Klasse übernehmen                   '''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cmduebernehmen_Click()

    Application.Workbooks(VBAcoustic).Activate
    With frmVBAcousticTrenndecke

    'Trennbauteil: Holzdecke, Flanke: Holzständer-, Metallständer- oder Massivholzwand
    If .optDecke = True And .optHolzbau = True Then

        'Eingabe unsymmetrischer Wände abfangen
        If .chkSymmetrie.Value = False Then
            frmWarningMessage.Caption = "Bislang nur symmetrische Aufbauten möglich"
            frmWarningMessage.Show
            .chkSymmetrie.Value = True
            Exit Sub
        End If

        'Für flankierende Metallständerwände existieren noch keine Daten
        If .cboWandtyp = MSTW Or .cboWandtypER = MSTW Then
            frmWarningMessage.Caption = "Metallständerwände noch nicht berechenbar"
            frmWarningMessage.Show
            .cboWandtyp.BackColor = vbRed
            Exit Sub
        End If

        'Fläche des Trennbauteils
        If .chkRechteckraum = True Then
            If (IsNumeric(.txtL1) And IsNumeric(.txtL2)) Then clsDecke(1).Flaeche = .txtL1 * .txtL2 Else clsDecke(1).Flaeche = 0
        Else
        
        End If
        
        'Aufruf der Datenübergabe
        Call clsFlanke(intFlankenNr).Dateninput

        'Für die Berechnung nach DIN4109 sind alle Flanken gleich
        If bDIN4109 = True Then
            Call clsFlanke(2).Dateninput: clsFlanke(2).lfSR = IIf(frmVBAcousticTrenndecke.txtL2 = "", 0, frmVBAcousticTrenndecke.txtL2)
            Call clsFlanke(3).Dateninput: clsFlanke(3).lfSR = IIf(frmVBAcousticTrenndecke.txtL1 = "", 0, frmVBAcousticTrenndecke.txtL1)
            Call clsFlanke(4).Dateninput: clsFlanke(4).lfSR = IIf(frmVBAcousticTrenndecke.txtL2 = "", 0, frmVBAcousticTrenndecke.txtL2)
        End If

        'Rahmen ausblenden
        frmVBAcousticTrenndecke.frmFlankenwand.Visible = False
        
        'Flanke in Eingabe als gedrückt markieren
        frmVBAcousticTrenndecke("cmdFlanke" & intFlankenNr).BackColor = &H8000000F



    'Trennbauteil: Holzbauteil, Flanke: Holz- und Leichtbau
    ElseIf .optWand = True And .optHolzbau = True Then

    End If
    
    End With

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
'''''''''''' Berechnung starten (Werte in Excelsheet übertragen                     ''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cmdBerechnungsstart_Click()
    
    Application.Workbooks(VBAcoustic).Activate
    
    With frmVBAcousticTrenndecke
    
        'pdf schließen (falls offen)
        If .WebBrowserPDF.Visible = True Then Call pdfclose
        
        'Flankendarstellung zurücksetzen
        Call ChangeFlankenBild(0, True)
        
        'Ergebnisdarstellung wählen
        If bNichtmehrAnzeigen = False Then
            .frmErgebnisdarstellung.Top = Application.Height / 4 + .frmDebugfunktionen.Height + 10
            .frmErgebnisdarstellung.Left = Application.Width / 2 - .frmDebugfunktionen.Width / 2
            .frmErgebnisdarstellung.Visible = True
        Else
            Call application_Main.Berechnungsstart 'Berechnung starten
        End If
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
Private Sub cmdVBA_Click()
    Application.Workbooks(VBAcoustic).Activate
    Application.Visible = True
End Sub
Private Sub cmdValidierung_Click()
    Application.Workbooks(VBAcoustic).Activate
    Call Validierung.Validierungsstart
End Sub
Private Sub cmdValidierungsdaten_Click()
    Application.Workbooks(VBAcoustic).Activate
    Call Validierung.NeuerDatensatz_Trenndecke(0)
End Sub
Private Sub cmdpdf_Click()
    Call global_Function_Variables.pdfclose         'pdf  schließen
    frmVBAcousticTrenndecke.frmValidierung.Visible = False    'Rahmen "frmValidierung" ausblenden
End Sub
Private Sub optPDFhier_Click()          'Ergebnis - PDF im Browser darstellen
    PDFextern = False
    Worksheets("Definitionen").Cells(2, 13) = "Falsch"
    ActiveWorkbook.Save
End Sub

Private Sub optPDFViewer_Click()        'Ergebnis - PDF im Standard Viewer darstellen
    PDFextern = True
    Worksheets("Definitionen").Cells(2, 13) = "Wahr"
    ActiveWorkbook.Save
End Sub
Private Sub chkPDFAbfrage_Click()
    bNichtmehrAnzeigen = IIf(frmVBAcousticTrenndecke.chkPDFAbfrage = True, True, False)
End Sub
Private Sub cmdOK_Click()
    frmErgebnisdarstellung.Visible = False
    Call application_Main.Berechnungsstart 'Berechnung starten
End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Debugbelegung der Eingangsdaten                                         '''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cmdDebugbelegung_Click()
    Call Validierung.Validierungsstart
    frmVBAcousticTrenndecke.cboTrennbauteil = clsDecke(1).Deckentyp
    frmVBAcousticTrenndecke.cboEstrichtyp = clsDecke(1).Estrichtyp
    Call cmdDIN4109_Click
    Call frmDIN4109_33_Decken.optT25Z3_Click
    frmVBAcousticTrenndecke.txtDRUnterdecke = clsDecke(1).DRUnterdecke
    frmVBAcousticTrenndecke.txtL1 = clsDecke(1).L1
    frmVBAcousticTrenndecke.txtL2 = clsDecke(1).L2
    Call Validierung.Validierungsstart

End Sub
