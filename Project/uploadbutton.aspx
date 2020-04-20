<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="uploadbutton.aspx.cs" Inherits="accountmanager.uploadbutton" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">		
    	<asp:FileUpload ID="Uploader" runat="server" accept="image/*"/>
        <br />
        <br />
    	<asp:Button ID="UploadSubmit" runat="server" OnClick="UploadSubmit_Click" Text="Upload" />  
        <br />
        <asp:Label ID="StatusLabel" runat="server" Font-Italic="true" Text=""></asp:Label>
    </form>	
</body>
</html>
