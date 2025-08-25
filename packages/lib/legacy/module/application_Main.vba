
 Option Explicit

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
''''''''''''''''''''            Anwendungsoberfläche öffnen und Begrüßungsbild darstellen                       ''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
' Bildschirmauflösung

Public Sub VBAcoustic_start()

    'Startbild einblenden
    frmVBAcoustic.Show vbModeless
    'Bildschirmskalierung überprüfen
    If bScaling = True Then
        'Die Erhöhung der Bildschirmauflösung verhindert eine Skalierung und klare Darstellung der GUI
        Call frmWarningScaling.ScalingNote("Bildschirmauflösung", "Warning")
    End If

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
''''''''''''''''''''            Bauweise und Art des Trennbauteils festlegen                                    ''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Public Sub Programmsteuerung()
    'GUI frmAcoustic erneut Einblenden (bei Neustart)
    frmVBAcoustic.Show vbModeless
    'Ausblenden der momentan aktiven Trennbauteileingabe
    If frmVBAcousticTrenndecke.Visible = True Then
        frmVBAcousticTrenndecke.Hide
    ElseIf frmVBAcousticTrennwand.Visible = True Then
        frmVBAcousticTrennwand.Hide
    End If
    'Rahmen "Programmsteuerung" initialisieren und anzeigen
    Call frmVBAcoustic.frmProgrammsteuerung_Initialize
    frmVBAcoustic.frmProgrammsteuerung.Visible = True
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
''''''''''''''''''''            Bauteilauswahl  und Übernahme der Daten in die Objektklassen                    ''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Public Sub Bauteileingabe()

    Dim inti As Integer
    
    Workbooks(VBAcoustic).Activate
    '______________________________________________________________________________________________________________
    
    If frmVBAcoustic.optHolzbau = True And frmVBAcoustic.optDecke = True Then
                
        'Aktivieren von Tabellenblatt WTD_Holzbau
        Worksheets("WTD_Holzbau").Activate
        
        'GUI VBAcousticTrenndecke initialisieren und einblenden
        With frmVBAcousticTrenndecke
                       
            Call .frmProgrammsteuerungTrenndecke_Initialize         'Daten für ProgrammsteuerungÜbernehmen
            Call .frmTrenndeckeHolzbau_Initialize                   'Rahmen "frmTrenndeckeHolzbau" initialisieren
            Call .frmTrenndeckeHolzbau_restart                      'Vorbelegte Felder für Neustart zurücksetzen
            .frmTrenndeckeHolzbau.Visible = True                    'Rahmen "frmTrenndeckeHolzbau" anzeigen
            .frmValidierung.Visible = False                         'Rahmen "frmValidierung" ausblenden
            .Show vbModeless
            
        End With

        'GUI- VBAcoustic ausblenden
        frmVBAcoustic.Hide
        
        'Objekt Decke der Klasse Trennbauteil anlegen
        ReDim Preserve clsDecke(1 To 1)
        If Not clsDecke(1) Is Nothing Then Set clsDecke(1) = Nothing
        Set clsDecke(1) = New clsTrenndecke
        
        'Objekt Flanke der Klasse Flankenbauteil anlegen
        ReDim Preserve clsFlanke(1 To 4)
        For inti = 1 To 4
            If Not clsFlanke(inti) Is Nothing Then Set clsFlanke(inti) = Nothing
            Set clsFlanke(inti) = New clsFlankenbauteil
        Next inti
        
        
        'Tabellenblatt "WTD_Holzbau" initialisieren
        Application.Workbooks(VBAcoustic).Activate
        Call Worksheets("WTD_Holzbau").Initialize
        
    '______________________________________________________________________________________________________________
    
    ElseIf frmVBAcoustic.optHolzbau = True And frmVBAcoustic.optWand = True Then
            
            'Aktivieren von Tabellenblatt WTW_Holzbau
            Application.Workbooks(VBAcoustic).Activate
            Worksheets("WTW_Holzbau").Activate
             
            'Objekt Wand der Klasse Trennbauteil anlegen
            ReDim Preserve clsWand(1 To 1)
            Set clsWand(1) = New clsTrennwand

            'Objekt Flanke der Klasse Flankenbauteil anlegen
            ReDim Preserve clsFlanke(1 To 4)
            For inti = 1 To 4
            Set clsFlanke(inti) = New clsFlankenbauteil
            Next inti

            'GUI VBAcousticTrenndecke initialisieren und einblenden
            With frmVBAcousticTrennwand
                Call .frmProgrammsteuerungTrennwand_Initialize         'Daten für ProgrammsteuerungÜbernehmen
                Call .frmTrennWandHolzbau_Initialize                   'Rahmen "frmTrenndeckeHolzbau" initialisieren
                Call .frmTrennwandHolzbau_restart                      'Vorbelegte Felder für Neustart zurücksetzen
                .cboWandtyp = ""                                       'Wandtyp zurücksetzen
                .frmTrennwandHolzbau.Visible = True                    'Rahmen "frmTrenndeckeHolzbau" anzeigen
                .frmValidierung.Visible = False                         'Rahmen "frmValidierung" ausblenden
                .Show vbModeless
            End With
             
            'Tabellenblatt Trennwand initialisieren
            Application.Workbooks(VBAcoustic).Activate
            Call Worksheets("WTW_Holzbau").Initialize
            
            'GUI- VBAcoustic ausblenden und VBAcousticTrennWand einblenden
            frmVBAcoustic.Hide
            frmVBAcousticTrennwand.Show vbModeless
            
            'Rahmen "frmProgrammsteuerungTrennWand" in der neuen GUI noch einmal initialisieren
            Call frmVBAcousticTrennwand.frmProgrammsteuerungTrennwand_Initialize
    
            'Rahmen "frmValidierung" ausblenden
            frmVBAcousticTrennwand.frmValidierung.Visible = False
    '______________________________________________________________________________________________________________

'
'    elseIf frmVBAcoustic.optMassivbau = True And frmVBAcoustic.optDecke = True Then frmTrenndeckeMassivbau.Visible = True
'    elseIf frmVBAcoustic.optMassivbau = True And frmVBAcoustic.optWand = True Then frmTrennwandMassivbau.Visible = True

    '______________________________________________________________________________________________________________
    
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
''''''''''''''''''''            Datencheck und Berechnung                                                       ''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Sub Berechnungsstart()

    'Bauteildaten auf Vollständigkeit überprüfen
    If (calc_Holzbau_single.Bauteilueberpruefung = False) Then Exit Sub
    
    'Flankenübertragung berechnen
    Call calc_Holzbau_single.Flankenberechnung
    
    'Bauwerte berechnen
    Call calc_Holzbau_single.Bauwerte
        
    'Button "Datensatz zu Validierungsdaten hinzufügen" anzeigen
    Call Validierung.Validierungsbuttons
    
    'Ergebnisse in das Excel-Tabellenblatt übertragen und als pdf anzeigen
    Application.Workbooks(VBAcoustic).Activate
    If frmVBAcoustic.optHolzbau = True And frmVBAcoustic.optDecke = True Then
        Call Worksheets("WTD_Holzbau").Ergebnisprotokoll
    ElseIf frmVBAcoustic.optHolzbau = True And frmVBAcoustic.optWand = True Then
        Call Worksheets("WTW_Holzbau").Ergebnisprotokoll
    End If

End Sub

    
    


