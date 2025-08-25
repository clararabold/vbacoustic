Option Explicit

Private TopPosBild As Integer
Private LeftPosBild As Integer
Private TopPosKonstruktion As Integer
Private LeftPosKonstruktion As Integer
Private ShapeNamen1() As Variant
Private ShapeNamen2() As Variant




''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''            Tabellenblatt initialisieren                             '''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Public Sub initialize_Bauteilschichten()
    
    Dim objShape As Shape
    
    If frmVBAcoustic.optHolzbau = True And frmVBAcoustic.optDecke = True Then
        'Bildposition
        TopPosBild = Tabelle9.Range("C11").Top + 10
        LeftPosBild = Tabelle9.Range("C11").Left + 10
        TopPosKonstruktion = Tabelle9.Range("D11").Top + 10
        LeftPosKonstruktion = Tabelle9.Range("D11").Left + 10
        
        'Vorhandenes Bild löschen
        Application.Worksheets("WTD_Holzbau").Activate
    
        For Each objShape In ActiveSheet.Shapes
            If objShape.Left = LeftPosBild Or objShape.Left = LeftPosKonstruktion Then
                objShape.Delete
            End If
        Next
    
    ElseIf frmVBAcoustic.optHolzbau = True And frmVBAcoustic.optWand = True Then
        'Bildposition
        TopPosBild = Tabelle9.Range("C11").Top + 10
        LeftPosBild = Tabelle9.Range("C11").Left + 10
        TopPosKonstruktion = Tabelle9.Range("D11").Top + 10
        LeftPosKonstruktion = Tabelle9.Range("D11").Left + 10
        
        'Vorhandenes Bild löschen
        Application.Worksheets("WTW_Holzbau").Activate
    
        For Each objShape In ActiveSheet.Shapes
            If objShape.Left = LeftPosBild Or objShape.Left = LeftPosKonstruktion Then
                objShape.Delete
            End If
        Next
    
    End If

End Sub



''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''            Bauteilschicht hinzufügen                                 ''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Public Sub AddImg(imgB As String, imgK As String)

    Dim inti As Integer
    Dim objShape As Shape
    
    On Error Resume Next
    
    'Bild in Tabellenblatt "Bauteilschichten" suchen und kopieren
    Application.Worksheets("Bauteilschichten").Activate
    ActiveSheet.Shapes.Range(Array(imgB)).Select: Selection.Copy
    
    'Bild in Tabellenblatt "WTD_Holzbau" bzw. "WTW_Holzbau" einfügen
    If frmVBAcoustic.optHolzbau = True And frmVBAcoustic.optDecke = True Then
        Application.Worksheets("WTD_Holzbau").Activate
        Tabelle9.Range("N11").Select
        ActiveSheet.Pictures.Paste.Select

    ElseIf frmVBAcoustic.optHolzbau = True And frmVBAcoustic.optWand = True Then
        Application.Worksheets("WTW_Holzbau").Activate
        Tabelle10.Range("N11").Select
        ActiveSheet.Pictures.Paste.Select

    End If
    
    
    'Bild erneut auswählen, verschieben und gruppieren
    inti = 0
    For Each objShape In ActiveSheet.Shapes
        If objShape.TopLeftCell.Address = "$N$11" Then
            objShape.Top = TopPosBild: TopPosBild = TopPosBild + objShape.Height
            objShape.Left = LeftPosBild
            Exit For
        End If
    Next

    
    'Konstruktionsbeschreibung in Tabellenblatt "Bauteilschichten" suchen und kopieren
    Application.Worksheets("Bauteilschichten").Activate
    ActiveSheet.Shapes.Range(Array(imgK)).Select: Selection.Copy
    
    'Zielbereich wählen und Konstruktionsbeschreibung einfügen
    If frmVBAcoustic.optHolzbau = True And frmVBAcoustic.optDecke = True Then
        Application.Worksheets("WTD_Holzbau").Activate
        Tabelle9.Range("T11").Select
        ActiveSheet.Pictures.Paste.Select
    ElseIf frmVBAcoustic.optHolzbau = True And frmVBAcoustic.optWand = True Then
        Application.Worksheets("WTW_Holzbau").Activate
        Tabelle10.Range("T11").Select
        ActiveSheet.Pictures.Paste.Select
    End If
    
    
    'Bild erneut auswählen und verschieben
    inti = 0
    For Each objShape In ActiveSheet.Shapes
        If objShape.TopLeftCell.Address = "$T$11" Then
            objShape.Top = TopPosKonstruktion: TopPosKonstruktion = TopPosKonstruktion + objShape.Height
            objShape.Left = LeftPosKonstruktion
            Exit For
        End If
    Next
        
End Sub


Public Sub Gruppieren()

    Dim objShape As Shape
    Dim GesamtBild As Variant
    Dim GesamtKonstruktion As Variant

'    Application.Worksheets("WTD_Holzbau").Activate
'
'    Set GesamtKonstruktion = ActiveSheet.Shapes.Range(ShapeNamen2)
'    Set objShape = GesamtKonstruktion.Group
'    objShape.CopyPicture Appearance:=xlScreen, Format:=xlPicture
'    'objShape.Name = "Kostruktionsbeschreibung"
'    ActiveSheet.ImgKonstruktion1.Picture.Paste
'
'
'        For Each objShape In ActiveSheet.Shapes
'        If objShape.TopLeftCell.Address = "$N$11" Then
'            inti = inti + 1
'            ReDim ShapeNamen1(1 To inti)
'            ShapeNamen1(inti) = objShape.Name
'            objShape.Top = TopPosBild
'            TopPosBild = TopPosBild + objShape.Height
'            objShape.Left = LeftPosBild
'            Exit For
'        End If
'    Next


End Sub



