### 1. Echo 程序
- 客户端：向Server Socket发送一条信息，并阻塞接收
- 服务端：接受一个客户端发送的一条信息，并返回系统时间
1. Client逻辑
```cs
// Connect function
    public void ConnectedToServer()
    {
        // socket ip,type and protocol
        socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
        // server ip and port
        socket.Connect("127.0.0.1", 8888);
    }

    // Send Message function
    public void SendMsgToServer()
    {
        // send bytes
        string sendStr = inputField.text;
        byte[] bytes = System.Text.Encoding.Default.GetBytes(sendStr);
        socket.Send(bytes);
        // receive bytes
        byte[] readBuf = new byte[1024];
        int count = socket.Receive(readBuf);
        string receiveStr = System.Text.Encoding.Default.GetString(readBuf,0,count);
        text.text = receiveStr;
        // close client
        socket.Close();
    }
```

2. Server逻辑
```cs
static void Main()
        {            
            Console.WriteLine("Server Start...");
            // Socket ip,type,protocal
            Socket socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
            //socket ip address
            IPAddress ip = IPAddress.Parse("127.0.0.1");
            // socket port
            IPEndPoint port = new IPEndPoint(ip, 8888);
            // bind
            socket.Bind(port);
            // Listen
            socket.Listen(0);
            Console.WriteLine("Listening...");
            while (true)
            {
                // Accept
                Socket client = socket.Accept();
                Console.WriteLine("Accept client...");
                // Receive
                byte[] readBuf = new byte[1024];
                int count = client.Receive(readBuf);
                string readStr = System.Text.Encoding.Default.GetString(readBuf, 0, count);
                Console.WriteLine("Receive Message: " + readStr);
                // Send time
                string timeStr = System.DateTime.Now.ToString();
                byte[] sendBytes = System.Text.Encoding.Default.GetBytes(timeStr);
                client.Send(sendBytes);
            }
            //Console.ReadKey();
        }
```