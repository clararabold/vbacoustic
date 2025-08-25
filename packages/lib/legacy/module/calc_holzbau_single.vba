Option Explicit
Public bCancel As Boolean

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''            Bauteildaten auf Vollständigkeit überprüfen                                     ''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function Bauteilueberpruefung() As Boolean

    'lokale Variablen deklarieren
    Dim IsError As Boolean
    Dim checkdata As Boolean
    Dim inti As Integer
    Dim nFlanken As Integer

    IsError = False
    
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    'Trennbauteil: Holzdecke, Flanke: Holz- oder Leichtbau                '
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    With frmVBAcousticTrenndecke
    
        If .optDecke = True And .optHolzbau = True Then
    
            'Daten für Trenndecke und Flanken auf Vollständigkeit überprüfen
            checkdata = clsDecke(1).checkdata_Trenndecke()
            If checkdata = False Then
                IsError = True
            End If
            
            For inti = 1 To 4
                checkdata = clsFlanke(inti).checkdata_Flanke()
                If checkdata = False Then
                    IsError = True
                    If bDIN4109 = True Then
                        frmVBAcousticTrenndecke.cmdFlankeDIN4109.BackColor = vbRed
                    Else
                        frmVBAcousticTrenndecke("cmdFlanke" & inti).BackStyle = 1
                        frmVBAcousticTrenndecke("cmdFlanke" & inti).BackColor = vbRed

                    End If
                End If
            Next inti
            
            'Prozedurabbruch wenn Daten unvollständig
            If IsError = True Then
                Call frmWarningMessage.WarningMessage("Daten unvollständig!", "Warning")
                Exit Function
            End If
        End If
            
    End With
            
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    'Trennbauteil: Holz- o. Leichtbau, Flanke: Holz- Leicht- o. Massivbau '
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    With frmVBAcousticTrennwand
        If .optWand = True And .optHolzbau = True Then
        
            
            'Daten für Trennwand und Flanken auf Vollständigkeit überprüfen
            checkdata = clsWand(1).checkdata_Trennwand()
            If checkdata = False Then
                IsError = True
            End If
            
            nFlanken = IIf(clsWand(1).Raumanordnung = DIAGONAL, 2, 4)
            For inti = 1 To nFlanken
                checkdata = clsFlanke(inti).checkdata_Flanke()
                If checkdata = False Then
                    IsError = True
                    If clsWand(1).Raumanordnung = DIAGONAL Then
                        frmVBAcousticTrennwand("cmdFlanke" & inti & "_Holz_0m2").BackColor = vbRed
                    Else
                        frmVBAcousticTrennwand("cmdFlanke" & inti & "_Holz").BackColor = vbRed
                    End If
                End If
            Next inti
            
            'Prozedurabbruch wenn Daten unvollständig
            If IsError = True Then
                Call frmWarningMessage.WarningMessage("Daten unvollständig!", "Warning")
                Exit Function
            End If
        
        End If
        
    End With
           
    
    'Rückgabewert: Daten vollständig?
    Bauteilueberpruefung = IIf(IsError = True, False, True)
    
End Function


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''            Flankenübertragung berechnen                                                    ''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Public Sub Flankenberechnung()

    'lokale Variablen deklarieren
    Dim inti As Integer
        
    ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    'Trennbauteil: Holzdecke, Flanke: Holz- oder Leichtbau                     '
    ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    If frmVBAcoustic.optDecke = True And frmVBAcoustic.optHolzbau = True Then
    
        For inti = 1 To 4
        
            Call clsFlanke(inti).Rijw_Flanke(clsDecke(1).Deckentyp, clsDecke(1).Rw, clsDecke(1).Rsw, clsDecke(1).DREstrich, clsDecke(1).DRUnterdecke, 4.5, clsDecke(1).Flaeche)
            Call clsFlanke(inti).Lnijw_Flanke(clsDecke(1).Deckentyp, clsDecke(1).Estrichtyp, clsDecke(1).Lnw, clsDecke(1).DLUnterdecke, clsDecke(1).Flaeche)
        
        Next inti

    ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    'Trennbauteil: Leichtbauwand, Flanke: Holzbau, Leichtbau, Massivbau        '
    ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    ElseIf frmVBAcoustic.optWand = True And frmVBAcoustic.optHolzbau = True Then
    
        If clsWand(1).Raumanordnung = DIAGONAL Then
        
            Call clsFlanke(1).Rijw_Flanke(clsFlanke(2).FlankentypSR, clsWand(1).Rw, clsFlanke(2).RwSR, clsFlanke(2).DRwSR, clsFlanke(2).DRwER, 2.8, 10)
            Call clsFlanke(2).Rijw_Flanke(clsFlanke(1).FlankentypSR, clsWand(1).Rw, clsFlanke(1).RwSR, clsFlanke(1).DRwSR, clsFlanke(1).DRwER, 2.8, 10)
        
        Else
        
             For inti = 1 To 4
             
                'Sonderfall: zweischalige Wohnungs-Trennwand mit Massivholzflanke
                If clsWand(1).Anwendungstyp = WTW_2 And clsFlanke(inti).Stossstelle <> "" Then
                
                    Select Case clsFlanke(inti).Stossstelle
                    
                    Case "T-Stoss, flankierende Wand durchlaufend", "X-Stoss, flankierende Wand durchlaufend", _
                         "X-Stoss, flankierende Decke durchlaufend", "T-Stoss, flankierende Decke durchlaufend"
                    
                            Call clsFlanke(inti).Rijw_Flanke(clsWand(1).Wandtyp, clsWand(1).Rw, clsWand(1).Rsw, 0, 0, 2.8, clsWand(1).Flaeche)
                     
                    Case "Doppel-L-Stoss, flankierende Decke vollständig getrennt", "Doppel-T-Stoss, flankierende Decke vollständig getrennt", _
                         "Doppel-L-Stoss, flankierende Wand vollständig getrennt", "Doppel-T-Stoss, flankierende Wand vollständig getrennt", _
                         "Doppel-L-Stoss, flankierende Wand vollständig getrennt und unterbrochen", "Doppel-T-Stoss, flankierende Wand vollständig getrennt und unterbrochen"
                    
                            Call clsFlanke(inti).Rijw_Flanke(clsWand(1).Wandtyp, clsWand(1).Rw, clsWand(1).Rsw, clsWand(1).DRw_ER, clsWand(1).DRw_ER, 2.8, clsWand(1).Flaeche)
                    End Select
                
                'Standardfall: Einschalige Trennwand (ggf. mit VS-Schalen)
                Else
                    Call clsFlanke(inti).Rijw_Flanke(clsWand(1).Wandtyp, clsWand(1).Rw, clsWand(1).Rsw, clsWand(1).DRw_SR, clsWand(1).DRw_ER, 2.8, clsWand(1).Flaeche)
                End If
                
             Next inti
             
        End If
        
    End If
    
End Sub



''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''            Bauwerte berechnen                                                              ''''''''
''''''''''''''''''''                                                                                            ''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Sub Bauwerte()

    'lokale Variablen deklarieren
    Dim inti As Integer
    
    ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    'Trennbauteil: Holzdecke, Flanke: Holz- oder Leichtbau           '
    ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    If frmVBAcoustic.optDecke = True And frmVBAcoustic.optHolzbau = True Then

        If bDIN4109 = True Then
        
            ' Flanke als Holzständerwand "HSTW"
            If clsFlanke(1).FlankentypSR = HSTW Then
                Call clsDecke(1).RStrichw_Trenndecke(Array(clsFlanke(1).RFfw, 0, 0, clsFlanke(2).RFfw, 0, 0, _
                                                           clsFlanke(3).RFfw, 0, 0, clsFlanke(4).RFfw, 0, 0))
            End If
            
        Else
        
            Call clsDecke(1).RStrichw_Trenndecke(Array(clsFlanke(1).RFfw, clsFlanke(1).RDfw, clsFlanke(1).RFdw, _
                                                                     clsFlanke(2).RFfw, clsFlanke(2).RDfw, clsFlanke(2).RFdw, _
                                                                     clsFlanke(3).RFfw, clsFlanke(3).RDfw, clsFlanke(3).RFdw, _
                                                                     clsFlanke(4).RFfw, clsFlanke(4).RDfw, clsFlanke(4).RFdw))
                                                                
            Call clsDecke(1).Lstrichnw_Trenndecke(Array(clsFlanke(1).LnDFfw, clsFlanke(1).LnDfw, _
                                                                       clsFlanke(2).LnDFfw, clsFlanke(2).LnDfw, _
                                                                       clsFlanke(3).LnDFfw, clsFlanke(3).LnDfw, _
                                                                       clsFlanke(4).LnDFfw, clsFlanke(4).LnDfw))
        End If
        
    ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    'Trennbauteil: Leichtbau, Flanke: Holzbau                        '
    ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    ElseIf frmVBAcoustic.optWand = True And frmVBAcoustic.optHolzbau = True Then
            
            Call clsWand(1).RStrichw_Trennwand(Array(clsFlanke(1).RFfw, clsFlanke(1).RDfw, clsFlanke(1).RFdw, _
                                                                     clsFlanke(2).RFfw, clsFlanke(2).RDfw, clsFlanke(2).RFdw, _
                                                                     clsFlanke(3).RFfw, clsFlanke(3).RDfw, clsFlanke(3).RFdw, _
                                                                     clsFlanke(4).RFfw, clsFlanke(4).RDfw, clsFlanke(4).RFdw))
    
    End If

End Sub
    
'---------------------------------------------------------------------------------------------------------------------'
'---------------------- Rw_HB() berechnet das bewertete Schalldämm-Maß eines Massivholzbauteils ----------------------'
'---------------------------------------------------------------------------------------------------------------------'
Public Function Rw_HB(m_Bauteil As Double) As Double

    Rw_HB = 25 * Log10(m_Bauteil) - 7
    
End Function

'---------------------------------------------------------------------------------------------------------------------'
'---------------------- Rw_biegeweich() berechnet das bewertete Schalldämm-Maß eines ideal biegeweichen Bauteils -----'
'---------------------------------------------------------------------------------------------------------------------'
Public Function Rw_biegeweich(m_Bauteil As Double) As Double
    
    Rw_biegeweich = 20 * Log10(m_Bauteil) + 12

End Function

'---------------------------------------------------------------------------------------------------------------------'
'---------------------- Rw_beschwert() berechnet das bewertete Schalldämm-Maß eines ideal biegeweich  ----------------'
'---------------------- beschwerten Bauteils: Massivholzdecke mit Schüttung ------------------------------------------'
'---------------------------------------------------------------------------------------------------------------------'
Public Function Rw_beschwert(m_Bauteil As Double) As Double
    
    Rw_beschwert = 20 * Log10(m_Bauteil) + 10

End Function

'---------------------------------------------------------------------------------------------------------------------'
'---------------------- calcDRij,w() berechnet die resultierende Verbesserung durch Vorsatzschalen  ------------------'
'---------------------- auf dem Übertragungsweg ij aus den Verbesserungen der einzelnen VS  --------------------------'
'---------------------------------------------------------------------------------------------------------------------'
Public Function calcDRijw(DRiw As Double, DRjw As Double) As Double

    If DRiw > 0 Or DRjw > 0 Then
        calcDRijw = max_(DRiw, DRjw) + 0.5 * min_(DRiw, DRjw)
    Else
        calcDRijw = -max_(Abs(DRiw), Abs(DRjw)) - 0.5 * min_(Abs(DRiw), Abs(DRjw))
    End If
    
End Function

'---------------------------------------------------------------------------------------------------------------------'
'--- Kij_HB() berechnet das Stoßstellendämm-Maß (Einzahlwert)  -------------------------------------------------------'
'---------------------------------------------------------------------------------------------------------------------'
Public Function Kij_HB(Norm_Kij As String, Stossart As String, Weg As String, Uebertragungsrichtung As String, m_f As String, m_s As String) As Double
    
    Dim M As Double
    Dim DKij As Double
    
    'Logarithmisches Massenverhältnis
    If IsNumeric(m_s) And IsNumeric(m_f) Then
        If m_s > 0 And m_f > 0 Then M = Log10(m_s / m_f)
    Else
        M = 0
    End If
    
    'Kij in Abhängigkeit der Übertragungsrichtung, der Stoßart und dem Übertragungsweg
    If Uebertragungsrichtung = "vertikal" Then
       
        If Stossart = T_STOSS And Norm_Kij = DIN_EN_ISO12354 Then
            Select Case Weg
            Case "Ff": Kij_HB = 22
            Case "Fd": Kij_HB = 15
            Case "Df": Kij_HB = 15
            End Select
            
        ElseIf Stossart = T_STOSS Then
            Select Case Weg
            Case "Ff": Kij_HB = IIf(Norm_Kij = DIN4109_33, 21 + 4 * M + 3 * M ^ 2, 21)
            Case "Fd": Kij_HB = IIf(Norm_Kij = DIN4109_33, 12 + 14 * M ^ 2, 14)
            Case "Df": Kij_HB = IIf(Norm_Kij = DIN4109_33, 12 + 14 * M ^ 2, 14)
            End Select
            
        ElseIf Stossart = T_STOSS_ELAST_OBEN Then
            Select Case Weg
            Case "Ff": Kij_HB = IIf(Norm_Kij = DIN4109_33, 21 + 4 * M + 3 * M ^ 2, 21) + 5
            Case "Fd": Kij_HB = IIf(Norm_Kij = DIN4109_33, 12 + 14 * M ^ 2, 14) + 5
            Case "Df": Kij_HB = IIf(Norm_Kij = DIN4109_33, 12 + 14 * M ^ 2, 14)
            End Select
            
        ElseIf Stossart = T_STOSS_ELAST_OBEN_UNTEN Then
            Select Case Weg
            Case "Ff": Kij_HB = IIf(Norm_Kij = DIN4109_33, 21 + 4 * M + 3 * M ^ 2, 21) + 10
            Case "Fd": Kij_HB = IIf(Norm_Kij = DIN4109_33, 12 + 14 * M ^ 2, 14) + 5
            Case "Df": Kij_HB = IIf(Norm_Kij = DIN4109_33, 12 + 14 * M ^ 2, 14) + 5
            End Select
            
         ElseIf Stossart = X_STOSS And Norm_Kij = DIN_EN_ISO12354 Then
            Select Case Weg
            Case "Ff": Kij_HB = 23
            Case "Fd": Kij_HB = 18
            Case "Df": Kij_HB = 18
            End Select
           
        ElseIf Stossart = X_STOSS Then
            Select Case Weg
            Case "Ff": Kij_HB = IIf(Norm_Kij = DIN4109_33, 21 + 4 * M + 3 * M ^ 2, 21)
            Case "Fd": Kij_HB = IIf(Norm_Kij = DIN4109_33, 12 + 14 * M ^ 2, 14)
            Case "Df": Kij_HB = IIf(Norm_Kij = DIN4109_33, 12 + 14 * M ^ 2, 14)
            End Select
            
        ElseIf Stossart = X_STOSS_ELAST_OBEN Then
            Select Case Weg
            Case "Ff": Kij_HB = IIf(Norm_Kij = DIN4109_33, 21 + 4 * M + 3 * M ^ 2, 21) + 5
            Case "Fd": Kij_HB = IIf(Norm_Kij = DIN4109_33, 12 + 14 * M ^ 2, 14) + 5
            Case "Df": Kij_HB = IIf(Norm_Kij = DIN4109_33, 12 + 14 * M ^ 2, 14)
            End Select
            
        ElseIf Stossart = X_STOSS_ELAST_OBEN_UNTEN Then
            Select Case Weg
            Case "Ff": Kij_HB = IIf(Norm_Kij = DIN4109_33, 21 + 4 * M + 3 * M ^ 2, 21) + 10
            Case "Fd": Kij_HB = IIf(Norm_Kij = DIN4109_33, 12 + 14 * M ^ 2, 14) + 5
            Case "Df": Kij_HB = IIf(Norm_Kij = DIN4109_33, 12 + 14 * M ^ 2, 14) + 5
            End Select
            
        End If



    ElseIf Uebertragungsrichtung = "horizontal" Then
    
        '----------------- Flankierende Decke -----------------------------------------------------
        If Stossart = "X-Stoss, flankierende Decke durchlaufend" And Norm_Kij = DIN_EN_ISO12354 Then
            Select Case Weg
            Case "Ff": Kij_HB = 10 + 10 * M
            Case "Fd": Kij_HB = 18
            Case "Df": Kij_HB = 18
            End Select
        
        ElseIf Stossart = "T-Stoss, flankierende Decke durchlaufend" Then
            Select Case Weg
            Case "Ff": Kij_HB = 3
            Case "Fd": Kij_HB = IIf(Norm_Kij = DIN4109_33, 12 + 14 * M ^ 2, 14)
            Case "Df": Kij_HB = IIf(Norm_Kij = DIN4109_33, 12 + 14 * M ^ 2, 14)
            End Select
        
        ElseIf Stossart = "T-Stoss, flankierende Decke getrennt" Then
            Select Case Weg
            Case "Ff": Kij_HB = IIf(Norm_Kij = DIN4109_33, 12 + 10 * M + 11 * M ^ 2, 12 + 10 * M)
            Case "Fd": Kij_HB = IIf(Norm_Kij = DIN4109_33, 12 + 14 * M ^ 2, 14)
            Case "Df": Kij_HB = IIf(Norm_Kij = DIN4109_33, 12 + 14 * M ^ 2, 14)
            End Select
        
        ElseIf Stossart = "Doppel-L-Stoss, flankierende Decke vollständig getrennt" Then
            DKij = 20
            Select Case Weg
            Case "Ff": Kij_HB = 3 + DKij
            Case "Fd": Kij_HB = IIf(Norm_Kij = DIN4109_33, 10, 10)
            Case "Df": Kij_HB = IIf(Norm_Kij = DIN4109_33, 10, 10)
            End Select
            
        ElseIf Stossart = "Doppel-T-Stoss, flankierende Decke vollständig getrennt" Then
            DKij = 20
            Select Case Weg
            Case "Ff": Kij_HB = 3 + DKij
            Case "Fd": Kij_HB = IIf(Norm_Kij = DIN4109_33, 12 + 14 * M ^ 2, 14)
            Case "Df": Kij_HB = IIf(Norm_Kij = DIN4109_33, 12 + 14 * M ^ 2, 14)
            End Select

        '------------------ Flankierende Wand -----------------------------------------------------
        ElseIf Stossart = "T-Stoss, flankierende Wand durchlaufend" Then
            Select Case Weg
            Case "Ff": Kij_HB = IIf(Norm_Kij = DIN4109_33, 8 + 3 * M + 4 * M ^ 2, 8)
            Case "Fd": Kij_HB = IIf(Norm_Kij = DIN4109_33, 12 + 14 * M ^ 2, 14)
            Case "Df": Kij_HB = IIf(Norm_Kij = DIN4109_33, 12 + 14 * M ^ 2, 14)
            End Select
        
        ElseIf Stossart = "T-Stoss, flankierende Wand unterbrochen" And Norm_Kij = DIN_EN_ISO12354 Then
            Select Case Weg
            Case "Ff": Kij_HB = 22
            Case "Fd": Kij_HB = 15
            Case "Df": Kij_HB = 15
            End Select
        
        ElseIf Stossart = "T-Stoss, flankierende Wand getrennt" Then
            Select Case Weg
            Case "Ff": Kij_HB = IIf(Norm_Kij = DIN4109_33, 15 + 3 * M + 4 * M ^ 2, 15)
            Case "Fd": Kij_HB = IIf(Norm_Kij = DIN4109_33, 12 + 14 * M ^ 2, 14)
            Case "Df": Kij_HB = IIf(Norm_Kij = DIN4109_33, 12 + 14 * M ^ 2, 14)
            End Select
        
        ElseIf Stossart = "T-Stoss, flankierende Wand unterbrochen" Then
            Select Case Weg
            Case "Ff": Kij_HB = IIf(Norm_Kij = DIN4109_33, 17 + 6 * M + 7 * M ^ 2, 17)
            Case "Fd": Kij_HB = IIf(Norm_Kij = DIN4109_33, 12 + 14 * M ^ 2, 14)
            Case "Df": Kij_HB = IIf(Norm_Kij = DIN4109_33, 12 + 14 * M ^ 2, 14)
            End Select
        
        
        ElseIf Stossart = "Doppel-L-Stoss, flankierende Wand vollständig getrennt" Then
            DKij = 20
            Select Case Weg
            Case "Ff": Kij_HB = IIf(Norm_Kij = DIN4109_33, 8 + 3 * M + 4 * M ^ 2 + DKij, 8 + DKij)
            Case "Fd": Kij_HB = IIf(Norm_Kij = DIN4109_33, 10, 10)
            Case "Df": Kij_HB = IIf(Norm_Kij = DIN4109_33, 10, 10)
            End Select
        
        ElseIf Stossart = "Doppel-L-Stoss, flankierende Wand vollständig getrennt und unterbrochen" Then
            Select Case Weg
            Case "Ff": Kij_HB = 1000
            Case "Fd": Kij_HB = IIf(Norm_Kij = DIN4109_33, 10, 10)
            Case "Df": Kij_HB = IIf(Norm_Kij = DIN4109_33, 10, 10)
            End Select
        
        ElseIf Stossart = "Doppel-T-Stoss, flankierende Wand vollständig getrennt und unterbrochen" Then
            Select Case Weg
            Case "Ff": Kij_HB = 1000
            Case "Fd": Kij_HB = IIf(Norm_Kij = DIN4109_33, 12 + 14 * M ^ 2, 14)
            Case "Df": Kij_HB = IIf(Norm_Kij = DIN4109_33, 12 + 14 * M ^ 2, 14)
            End Select
            
        Else
            Kij_HB = 0
        
        End If
        
        

   
    End If
    
End Function

