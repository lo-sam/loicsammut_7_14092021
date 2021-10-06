<template>
<body>
  <main>
    <nav>
        <router-link to="/">
            <div id="corp">
                <img id="logo" src="./assets/icon.png" alt="logo Groupomania">
                <h1>Groupomania</h1>
            </div>
        </router-link>
        <ul id="burger">
            <li id="ico_user"><i class="far fa-user"></i></li>
            <li id="ico_cross"><i class="fas fa-times"></i></li>
            <ul class="sub">
               
                    <li>CONNEXION</li>
               
                    <li>INSCRIPTION</li>
               
            </ul>
        </ul>
    </nav>
    <router-view></router-view> 
  </main>
</body>
</template>

<style>

* {
  font-family: 'Poppins', sans-serif;
  margin:0;
  padding: 0;
  box-sizing: border-box;
}
body {
    background-color: #FFD7D7;
    justify-content: center;
    align-items: center;
    display: flex;
    min-height: auto;
}

a {
    text-decoration: none;
}

main {
    width: 1200px;
    margin: auto;
}

nav {
    display: flex;
}

#corp {
    display: flex;
}

#logo {
    width: 60px;
    margin: 9px 5% 0 5%;
   height: fit-content;
}

h1 {
    font-size: 40px;
    padding-top: 17px;
    color: #000;
}

#burger {
    position: relative;
    margin-left: auto;
    padding: 0;
    list-style: none;
    height: 53px;
    width: 44px;
    top: 12px;
    left: -39px;
}

#ico_user,
#ico_cross {
    position: relative;
    font-size: 40px;
    color: #fff;
    margin: 30px;
    top: -25px;
    left: -25px;
}

#ico_cross {
    display: none;
}

#burger:hover #ico_user {
    display: none;
}

#burger:hover #ico_cross {
    display: block;
}

.sub li {
    list-style: none;
    display: block;
    padding: 20px;
    color: #fff;
    cursor: pointer;
}

.sub {
    display: none;
    position: absolute;
    border-radius: 10% 0 10% 10%;
}

#burger:hover .sub {
    display: inline-block;
    padding: 0;
    left: -245%;
    top: 45px;
    background-color: #FFD7D7;
}


</style>
