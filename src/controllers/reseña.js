const Reseña = require('../models/Reseña.js');

const httpResena = {
  crearResena: async (req, res) => {
    try {
      const { usuario, distribuidor, producto, puntaje, comentario } = req.body;
      const nuevaResena = new Reseña({ usuario, distribuidor, producto, puntaje, comentario });
      await nuevaResena.save();
      res.status(201).json({ msg: 'Reseña registrada exitosamente', reseña: nuevaResena });
    } catch (error) {
      res.status(500).json({ msg: 'Error al registrar la reseña', error: error.message });
    }
  },

  listarResenasPorProducto: async (req, res) => {
    try {
      const { id } = req.params;
      const resenas = await Reseña.find({ producto: id }).populate('usuario', 'nombre');
      res.json(resenas);
    } catch (error) {
      res.status(500).json({ msg: 'Error al listar reseñas', error: error.message });
    }
  },

  listarResenasPorDistribuidor: async (req, res) => {
    try {
      const { id } = req.params;
      const resenas = await Reseña.find({ distribuidor: id }).populate('usuario', 'nombre');
      res.json(resenas);
    } catch (error) {
      res.status(500).json({ msg: 'Error al listar reseñas', error: error.message });
    }
  },

  listarResenasPorUsuario: async (req, res) => {
    try {
      const { id } = req.params;
      const resenas = await Reseña.find({ usuario: id }).populate('producto', 'nombre');
      res.json(resenas);
    } catch (error) {
      res.status(500).json({ msg: 'Error al listar reseñas', error: error.message });
    }
  }
};


module.exports = { httpResena };



// ejemplo reseña en frontend 

// <!-- Componente simple para mostrar y seleccionar estrellas -->
// <template>
//   <div>
//     <span
//       v-for="n in 5"
//       :key="n"
//       @click="setPuntaje(n)"
//       style="cursor:pointer; font-size:2rem;"
//     >
//       {{ n <= puntaje ? '★' : '☆' }}
//     </span>
//     <textarea v-model="comentario" placeholder="Escribe tu reseña..."></textarea>
//     <button @click="enviarResena">Enviar reseña</button>
//   </div>
// </template>

// <script setup>
// import { ref } from 'vue'
// const puntaje = ref(0)
// const comentario = ref('')

// function setPuntaje(n) {
//   puntaje.value = n
// }

// async function enviarResena() {
//   // Aquí debes enviar usuario, distribuidor, producto, puntaje y comentario al backend
//   // Ejemplo:
//   await fetch('/api/resena/crear', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json', Authorization: 'Bearer TU_TOKEN' },
//     body: JSON.stringify({
//       usuario: 'id_usuario',
//       distribuidor: 'id_distribuidor',
//       producto: 'id_producto',
//       puntaje: puntaje.value,
//       comentario: comentario.value
//     })
//   })
// }
// </script>