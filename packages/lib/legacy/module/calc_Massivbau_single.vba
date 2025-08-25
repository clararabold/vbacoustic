Option Explicit

Public Function RwBauteil(Bauweise As String, Material As String, M As Double, TrennbauteiloderFlanke As String) As Double
    
    '---------------------------------------------------------------------------------------------------------------------'
    '---------------------- Berechnet das bewertete Schalldämm-Maß eines Massivbauteils ----------------------------------'
    '---------------------------------------------------------------------------------------------------------------------'
    
    'Unterscheidung der Bauweisen nach Massivbau und Leichtbau
    If Bauweise = "Massivbau" Then
    
        'Materialabhängige Berechnung nach DIN 4109-02:2016
        If Material = SB_KS_MZ Or Material = "Beton" Then
            RwBauteil = 30.9 * Log10(M) - 22.2
            
        ElseIf Material = LEICHTB Then
            RwBauteil = 30.9 * Log10(M) - 20.2
            
        ElseIf Material = PORENB And M < 150 Then
            RwBauteil = 32.6 * Log10(M) - 22.5
        
        ElseIf Material = PORENB And M >= 150 Then
            RwBauteil = 26.1 * Log10(M) - 8.4
            
        Else
            RwBauteil = 0
            
        End If
        
    'Bei einer Leichtbautrennwand wird das Schalldämm-Maß vom Benutzer angegeben (in der Zelle der flächenbezogenen Masse)
    ElseIf Bauweise = "Leichtbau" And (Material = HSTW Or Material = "Montagewand") Then
        If TrennbauteiloderFlanke = "Trennbauteil" Then
            RwBauteil = M
        Else
            RwBauteil = 0
        End If
        
    ElseIf Bauweise = "Massivholzbau" And (Material = MHD Or Material = MHW) Then
        RwBauteil = Rw_HB(M)
        
    Else
        RwBauteil = 0
  
    End If


End Function
Public Function DRwVSSchale(d As Double, s As Double, m1 As Double, m2 As Double, Rw As Double) As Double

    '---------------------------------------------------------------------------------------------------------------------'
    '---------------------- Berechnet die Verbesserung durch Vorsatzschalen nach DIN 4109-34:2016 ------------------------'
    '---------------------------------------------------------------------------------------------------------------------'
    
    'Variablen deklarieren
    Dim f_0 As Double
    
    'Eingabe überprüfen
    If (d > 0 Xor s > 0) And m1 > 0 And m2 > 0 Then
    
        'f0 berechnen
        If d > 0 Then
            f_0 = 160 * Sqr(0.08 / d * (1 / m1 + 1 / m2))
        Else
            f_0 = 160 * Sqr(s * (1 / m1 + 1 / m2))
        End If
        
        'DRw berechnen
        
        If f_0 > 1600 Then
            DRwVSSchale = -5
            
        ElseIf f_0 >= 630 Then
            DRwVSSchale = -10
            
        ElseIf f_0 >= 500 Then
            DRwVSSchale = -9 - 1 / (630 - 500) * (f_0 - 500)
            
        ElseIf f_0 >= 400 Then
            DRwVSSchale = -7 - 2 / (500 - 400) * (f_0 - 400)
        
        ElseIf f_0 >= 315 Then
            DRwVSSchale = -5 - 2 / (400 - 315) * (f_0 - 315)
            
        ElseIf f_0 >= 250 Then
            DRwVSSchale = -3 - 2 / (315 - 250) * (f_0 - 250)
            
        ElseIf f_0 >= 200 Then
            DRwVSSchale = -1 - 2 / (250 - 200) * (f_0 - 200)
            
        ElseIf f_0 > 160 Then
            DRwVSSchale = 0 - 1 / (200 - 160) * (f_0 - 160)
            
        ElseIf f_0 >= 30 Then
            DRwVSSchale = 74.4 - 20 * Log10(f_0) - 0.5 * Rw
            If DRwVSSchale < 0 Then DRwVSSchale = 0
            
        Else
            MsgBox ("f_0 = " & Round(f_0, 1) & " Hz ist nicht zulässig")
            DRwVSSchale = 0
            
        End If
        
    Else
            DRwVSSchale = 0
    End If
    
    DRwVSSchale = Round(DRwVSSchale, 1)

End Function

'Public Function RDdw(Rw_0 As Double, DRw_1 As Double, DRw_2 As Double) As Double
'
'    '-------------------------------------------------------------------------------------------------------------------------------------------'
'    '--- Berechnet die Schalldämmung des Trennbauteils aus dem Grundelement und den Vorsatzschalen nach DIN 4109-2:2016 ------------------------'
'    '--------------------------------------------------------------------------------------------------------------------------------------------'
'
'    'Variablen deklarieren
'    Dim temp As Double
'
'    'DRw1 > DRw_2 !
'    If DRw_2 > DRw_1 Then
'        temp = DRw_2
'        DRw_2 = DRw_1
'        DRw_1 = temp
'    End If
'
'    If DRw_1 > 0 Then
'        RDdw = Rw_0 + DRw_1 + 0.5 * DRw_2
'    Else
'        RDdw = Rw_0 + DRw_2 + 0.5 * DRw_1
'    End If
'
'End Function
Public Function Rijw(Bauweise_Flanke As String, Bauweise_Trennbauteil As String, FlankenNr As String, Weg As String, Riw As Double, Rjw As String, DRijw As Double, Kij As Double, Ss As Double, lf As Double, lo As Double, Dnfw As Double) As Double
    
    '-------------------------------------------------------------------------------'
    '--- Berechnet das Flankendämm-Maß nach DIN 4109-2:2016 ------------------------'
    '-------------------------------------------------------------------------------'
    
    If Bauweise_Flanke = "Massivbau" Then
               
        If Bauweise_Trennbauteil <> "Massivbau" And Weg <> "Ff" Then
            Rijw = 0
        Else
            Rijw = (Riw + CDbl(Rjw)) / 2 + DRijw + Kij + 10 * Log10(Ss / lf)
        End If
        
        
    ElseIf Bauweise_Flanke = "Massivholzbau" Then
               
        If Bauweise_Trennbauteil <> MHW And Weg <> "Ff" Then
            Rijw = 0
        Else
            Rijw = (Riw + CDbl(Rjw)) / 2 + DRijw + Kij + 10 * Log10(Ss / lf)
        End If

        
    Else 'Leichtbauflanke
        If Weg <> "Ff" Then
            Rijw = 0
        Else
            Rijw = Dnfw + 10 * Log10(Ss / 10) + 10 * Log10(lo / lf)
        End If
    End If
    
   
End Function
Public Function RStrichw(Rw As Double, rngRijw As Range) As Double
   
    Dim Rijw As Range
    
    RStrichw = 10 ^ (-0.1 * Rw)
    
    For Each Rijw In rngRijw
      If IsNumeric(Rijw.Value) Then RStrichw = RStrichw + 10 ^ (-0.1 * CDbl(Rijw.Value))
    Next Rijw
    
    RStrichw = -10 * Log10(RStrichw)
    
End Function

Public Function Kij(Stossart As String, m_f As Double, m_s As Double, Weg As String, Bauweise_Flanke As String, Bauweise_Trennbauteil As String, Kijmin As Double) As Double
    
    '-------------------------------------------------------------'
    '--- Berechnet das Stoßstellendämm-Maß (Einzahlwert)       ---'
    '-------------------------------------------------------------'
    
    'Variablen deklarieren
    Dim M As Double
    
   
    'Unterscheidung Bauweise der Flanke:
    If Bauweise_Flanke = "Leichtbau" Then           'Leichtbau braucht kein Stoßstelldämm-Maß
        Kij = 0
    
    
    ElseIf Bauweise_Flanke = "Massivholzbau" Then   'Massivholzbau Stoßstelldämm-Maß berechnen
    
    
    ElseIf Bauweise_Flanke = "Massivbau" Then
    
        If Bauweise_Trennbauteil <> "Massivbau" Then 'Massive Flanke mit leichter Trennwand -> Kijmin
            If Weg = "Ff" Then
                Kij = Kijmin
            Else
                Kij = 0
            End If
        
        ElseIf Stossart = T_STOSS Then                'massiver T-Stoss, Berechnung nach DIN 4109-2:2016
        
            'Massenverhätltnis
            M = Log10(m_s / m_f)
        
        
            If Weg = "Ff" And M < 0.215 Then
                    Kij = 5.7 + 14.1 * M + 5.7 * M ^ 2
            ElseIf Weg = "Ff" And M >= 0.215 Then
                    Kij = 8 + 6.8 * M
            ElseIf Weg = "Fd" Or Weg = "Df" Then
                    Kij = 4.7 + 5.7 * M ^ 2
            End If
        
        
        ElseIf Stossart = X_STOSS Then                    'massiver X-Stoss, Berechnung nach DIN 4109-2:2016
            
            'Massenverhätltnis
            M = Log10(m_s / m_f)
            
            If Weg = "Ff" And M < 0.182 Then
                    Kij = 8.7 + 17.1 * M + 5.7 * M ^ 2
            ElseIf Weg = "Ff" And M >= 0.182 Then
                    Kij = 9.6 + 11 * M
            ElseIf Weg = "Fd" Or Weg = "Df" Then
                    Kij = 5.7 + 15.4 * M ^ 2
            End If
            
        End If
        
    End If
    
End Function


Public Function DLw(s As Double, M As Double, Estrichtyp As String) As Double

    If Estrichtyp = "Zementestrich" Then
        DLw = 13 * Log10(M) - 14.2 * Log10(s) + 20.8
            
        
    ElseIf Estrichtyp = "Gussasphalt-, Fertigteilestrich" Then
        DLw = (-0.21 * M - 5.45) * Log10(s) + 0.46 * M + 23.8
            
    Else
        MsgBox ("Estrichtyp wählen")
        DLw = 0
  
    End If

End Function

Public Function Lstrichnw(Lnw As Double, ms As Double, mfm As Double, Unterdecke As String) As Double

    If Unterdecke = "ohne Unterdecke" Then
    
        If mfm > ms Then
            Lstrichnw = Lnw
        Else
            Lstrichnw = Lnw + 0.6 + 5.5 * Log10(ms / mfm)
            
        End If
        
    ElseIf Unterdecke = "mit Unterdecke" Then
    
        If mfm > ms Then
            Lstrichnw = Lnw
        Else
            Lstrichnw = Lnw - 5.3 + 10.2 * Log10(ms / mfm)
            
        End If

            
    Else
        MsgBox ("Unterdecke wählen")
        Lstrichnw = 0
  
    End If

End Function




