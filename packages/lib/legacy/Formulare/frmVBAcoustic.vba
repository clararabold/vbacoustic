
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''            Anwendungsoberfläche von VBAcoustic                      '''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

Option Explicit
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''            Bildschirmzugriff über dll                                '''''''''''''''''''''''''''''''
'''''''''''''''''''            GetSystemMetrics32 info: http://msdn.microsoft.com/en-us/library/ms724385(VS.85).aspx  ''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
#If Win64 Then
    Private Declare PtrSafe Function GetSystemMetrics32 Lib "User32" Alias "GetSystemMetrics" (ByVal nIndex As Long) As Long
#ElseIf Win32 Then
    Private Declare Function GetSystemMetrics32 Lib "User32" Alias "GetSystemMetrics" (ByVal nIndex As Long) As Long
#End If

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''            Deklaration der Variablen auf Modulebene                 '''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private intFlankenNr As Integer
Private wshshell As Object



''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''             #####     #############   ##########    ######               ########          ''''''''
''''''''''''''''''''           ##     ##         #         #             #    ###                 #             ''''''''
''''''''''''''''''''          ##       #         #         #             #      ##                #             ''''''''
''''''''''''''''''''           ##                #         #             #      ##                #             ''''''''
''''''''''''''''''''            ####             #         #             #    ###                 #             ''''''''
''''''''''''''''''''               ####          #         #########     ######                   #             ''''''''
''''''''''''''''''''                  ##         #         #             #                        #             ''''''''
''''''''''''''''''''           #       ##        #         #             #                        #             ''''''''
''''''''''''''''''''           ##     ##         #         #             #                        #             ''''''''
''''''''''''''''''''             #####           #         ##########    #                     #######          ''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''            Anwendungsoberfläche  für VBAcoustic initialisieren                             ''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub UserForm_Initialize()

    Const SM_CXVIRTUALSCREEN = 78
    Const SM_CYVIRTUALSCREEN = 79
    Const SM_CXSCREEN = 0
    Const SM_CYSCREEN = 1
    
    Dim intScreenHeight As Double
    

    Application.WindowState = xlMaximized
    
    With frmVBAcoustic
    
        'Bildschirmskalierung überprüfen
        intScreenHeight = GetSystemMetrics32(SM_CYSCREEN)
        If CDbl(intScreenHeight / Application.Height) > 1.5 Then
        
            bScaling = True
        
        Else
        
            bScaling = False
            
        End If
    
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
        Call global_Function_Variables.SetDeviceIndependentWindow(Me)

        'Anwendungsoberfläche auf Bildschirmgröße skalieren
        .Height = 0.98 * Application.Height
        .Width = 0.99 * Application.Width
        .Top = 0
        .Left = Application.Left
        
        'Bildgrößen anhand der Auflösung festlegen
        If intAppHeight < 600 Then
            .ImgTitelbild.Picture = .ImgTitelbild2.Picture
            .ImgTitelbild.Height = .ImgTitelbild2.Height
            .ImgTitelbild.Width = .ImgTitelbild2.Width
            .ImgWand.Picture = .ImgWandKlein.Picture
           
        Else
            .ImgTitelbild.Picture = .ImgTitelbild1.Picture
            .ImgTitelbild.Height = .ImgTitelbild1.Height
            .ImgTitelbild.Width = .ImgTitelbild1.Width
        End If
     
        .ImgTitelbild.Top = intAppHeight / 2 - .ImgTitelbild.Height / 2
        .ImgTitelbild.Left = Application.Width / 2 - .ImgTitelbild.Width / 2

        'Command-Button "Programmstart" platzieren
        .cmdProgrammstart.Top = intAppHeight - 100
        .cmdProgrammstart.Left = Application.Width - .cmdProgrammstart.Width / 2 - 100
        
        'Rahmen zunächst ausblenden
        .frmProgrammsteuerung.Visible = False
        

    End With

End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''             #####     #############   ##########    ######               ###########       ''''''''
''''''''''''''''''''           ##     ##         #         #             #    ###                 #  #          ''''''''
''''''''''''''''''''          ##       #         #         #             #      ##                #  #          ''''''''
''''''''''''''''''''           ##                #         #             #      ##                #  #          ''''''''
''''''''''''''''''''            ####             #         #             #    ###                 #  #          ''''''''
''''''''''''''''''''               ####          #         #########     ######                   #  #          ''''''''
''''''''''''''''''''                  ##         #         #             #                        #  #          ''''''''
''''''''''''''''''''           #       ##        #         #             #                        #  #          ''''''''
''''''''''''''''''''           ##     ##         #         #             #                        #  #          ''''''''
''''''''''''''''''''             #####           #         ##########    #                     ##########       ''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''            Programmsteuerung                                                               ''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Programmsteuerungsdialog bei click auf Programmstart-Buttoninitialisieren und anzeigen     ''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cmdProgrammstart_Click()
    'Programmsteuerung anzeigen
    Call application_Main.Programmsteuerung

End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Programmsteuerungsdialog initialisieren                                                    ''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Public Sub frmProgrammsteuerung_Initialize()

    Dim intTopPOS As Integer
    Dim intSpace As Integer
    
    
    With frmVBAcoustic
        .frmProgrammsteuerung.Top = 0                                               'Position vom oberen Bildschirmrand festlegen
        .frmProgrammsteuerung.Height = .Height - IIf(Application.Width < 1032, 35, 30)
        .frmProgrammsteuerung.Left = .Width - .frmProgrammsteuerung.Width - 15      'Position vom linken Bildschirmrand festlegen
        .cmdProgrammstart.Visible = False                                           'Programmstartbutton ausblenden
        .ImgTitelbild.Visible = False                                               'Begrüßungsbild ausblenden
        .ImgDecke.Visible = True                                                    'Bild "Übertragungswege Decken" einblenden
        .ImgWand.Visible = False                                                    'Bild "Übertragungswege Wand" ausblenden
        .optEinzahlwertISO12354 = True                                              'Optionsfeld "Einzahlwertberechnung" aktivieren
        .optManuell = True                                                          'Optionsfeld "Manuelle Eingabe" aktivieren
        .optHolzbau = True                                                          'Optionsfeld "Holzbau" aktivieren
'        .optDecke = True                                                             'Optionsfeld "Trenndecke" aktivieren
        .optWand = True                                                             'Optionsfeld "Trennwand" aktivieren
        
        intSpace = (.frmProgrammsteuerung.Height - ImgDecke.Height - frmGebaeudeeingabe.Height _
        - frmBauweise.Height - frmTrennbauteil.Height - frmBerechnungsmethode.Height _
        - .cmdCancel.Height) / 7                                                    'Zwischenraumhöhe berechnen
        
        intTopPOS = intSpace + ImgDecke.Height + intSpace
        frmGebaeudeeingabe.Top = intTopPOS                                          'Rahmen der Optionsfelder platzieren
        
        intTopPOS = intTopPOS + frmGebaeudeeingabe.Height + intSpace
        frmBauweise.Top = intTopPOS                                                 'Rahmen der Optionsfelder platzieren
        
        intTopPOS = intTopPOS + frmBauweise.Height + intSpace
        frmTrennbauteil.Top = intTopPOS                                             'Rahmen der Optionsfelder platzieren
        
        intTopPOS = intTopPOS + frmTrennbauteil.Height + intSpace
        frmBerechnungsmethode.Top = intTopPOS                                       'Rahmen der Optionsfelder platzieren
        
        intTopPOS = intTopPOS + frmBerechnungsmethode.Height + intSpace
        .cmdCancel.Top = intTopPOS                                                  'Rahmen der Optionsfelder platzieren
        .cmdBauteileingabe.Top = intTopPOS                                          'Rahmen der Optionsfelder platzieren
        
    End With
    
       
End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''     Programmsteuerungsdialog: Trennbauteil Decke oder Wand auswählen                  '''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub optDecke_Click()
    ImgWand.Visible = False      'Bild "Übertragungswege Wand" ausblenden
    ImgDecke.Visible = True       'Bild "Übertragungswege Decken" einblenden
    ImgDecke.Top = 30
End Sub
Private Sub optWand_Click()
    ImgDecke.Visible = False      'Bild "Übertragungswege Decke" ausblenden
    ImgWand.Visible = True       'Bild "Übertragungswege Wand" einblenden
    ImgWand.Top = 30
End Sub
Private Sub OptionButton1_Click()
    frmWarningMessage.Caption = "sorry"
    frmWarningMessage.Show
    frmVBAcoustic.optDecke = True
End Sub
Private Sub optMassivbau_Click()
    frmWarningMessage.Caption = "sorry"
    frmWarningMessage.Show
    frmVBAcoustic.optHolzbau = True
End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''    Programmsteuerungsdialog: "Einzahlwertberechnung" oder "frequenzabhängige Berechnung" auswählen    '''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub optFrequenzabhaengig_Click()
    Dim inti As Integer
    frmWarningMessage.Caption = "sorry"
    frmWarningMessage.Show
    optEinzahlwertISO12354 = True
End Sub
Private Sub optEinzahlwertDIN4109_Click()
    bDIN4109 = True
    With frmVBAcousticTrenndecke
        .cmdFlankeDIN4109.Visible = True
        .cmdFlanke1.Visible = False: .cmdFlanke2.Visible = False
        .cmdFlanke3.Visible = False: .cmdFlanke4.Visible = False
    End With
End Sub
Private Sub optEinzahlwertISO12354_Click()
    bDIN4109 = False
    With frmVBAcousticTrenndecke
        .cmdFlankeDIN4109.Visible = False
        .cmdFlanke1.Visible = True: .cmdFlanke2.Visible = True
        .cmdFlanke3.Visible = True: .cmdFlanke4.Visible = True
    End With
End Sub



''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''    Programmsteuerungsdialog: "Manuelle Eingabe" oder "ifc-Datei einlesen" auswählen     '''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub optIFCeinlesen_Click()
    Dim inti As Integer
    frmWarningMessage.Caption = "sorry"
    frmWarningMessage.Show
    optManuell = True
End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''    Programmsteuerungsdialog bei click auf Programmstart-Buttoninitialisieren und anzeigen   '''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cmdBauteileingabe_Click()
    'Bauteileingabe anzeigen
    Call application_Main.Bauteileingabe
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''    Programmsteuerungsdialog: Programmabbruch                   ''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub cmdCancel_Click()
    'ThisWorkbook.Saved = True
    Application.Visible = True
    Application.Quit
End Sub
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Beim "Wegklicken" der VBAcoustic Oberfläche auch Excel schließen        ''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Private Sub UserForm_QueryClose(Cancel As Integer, CloseMode As Integer)
'    ThisWorkbook.Saved = True
'    Application.Visible = True
'    Application.Quit
End Sub




